import NodeMediaServer from "node-media-server";
import { exec } from "child_process";
import { getStreamKeyFromStreamPath } from "../utils/getStreamKey";
import fs from "fs";
import path from "path";

const rtmpServer = () => {
  const config = {
    rtmp: {
      port: 1935,
      chunk_size: 60000,
      gop_cache: true,
      ping: 60,
      ping_timeout: 30,
    },
  };

  const nms = new NodeMediaServer(config);

  nms.on("prePublish", (id, streamPath, args) => {
    console.log(
      "[NodeEvent on prePublish]",
      `id=${id} streamPath=${streamPath} args=${JSON.stringify(args)}`
    );

    const stream_key = getStreamKeyFromStreamPath(streamPath);

    const inputPath = "rtmp://localhost:1935/live/" + stream_key;
    const outputPath = "./hls/stream.m3u8";
    const command = `ffmpeg -i ${inputPath} -codec:v h264 -codec:a aac -f hls -hls_list_size 10 -hls_time 2 ${outputPath}`;
    console.log(command);

    const ffmpeg = exec(command);

    if (!ffmpeg.stdout || !ffmpeg.stderr) {
      return;
    }

    ffmpeg.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    ffmpeg.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    ffmpeg.on("close", (code) => {
      console.log(`FFmpeg process exited with code ${code}`);
    });
  });

  nms.on("donePublish", (id, streamPath, args) => {
    console.log(
      "[NodeEvent on donePublish]",
      `id=${id} streamPath=${streamPath} args=${JSON.stringify(args)}`
    );
    //supprime tout les fichier dans /hls qui comportent ".ts" en javascript et sans ligne de commande
    fs.readdir("./hls", (err, files) => {
      if (err) throw err;

      for (const file of files) {
        if (file.endsWith(".ts")) {
          fs.unlink(path.join("./hls", file), (err) => {
            if (err) throw err;
          });
        }
      }

      console.log("All .ts files have been removed!");
    });
  });

  nms.run();
};

export default rtmpServer;
