import NodeMediaServer from "node-media-server";
import { exec } from "child_process";
import { getStreamKeyFromStreamPath } from "../utils/getStreamKey";
import fs from "fs";
import path from "path";
import UserModel from "../Model/User";

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

  nms.on("prePublish", async (id, streamPath, args) => {
    console.log(
      "[NodeEvent on prePublish]",
      `id=${id} streamPath=${streamPath} args=${JSON.stringify(args)}`
    );

    const stream_key = getStreamKeyFromStreamPath(streamPath);

    const user = await UserModel.findOne({ streamKey: stream_key });
    console.log(
      `voici l'utilisateur qui pocède la clé de stream suivante: ${stream_key} `
    );
    console.log(user);

    if (!user) {
      console.log("no user found");
      return;
    }

    const inputPath = "rtmp://localhost:1935/live/" + stream_key;
    const outputPath = "./hls/stream.m3u8";
    const command = `ffmpeg -i ${inputPath} -codec:v h264 -codec:a aac -f hls -hls_list_size 10 -hls_time 2 ${outputPath}`;

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

    fs.readdir("./hls", (err, files) => {
      if (err) throw err;

      for (const file of files) {
        if (file.endsWith(".ts")) {
          fs.unlink(path.join("./hls", file), (err) => {
            if (err) throw err;
          });
        }
      }
    });
  });

  nms.on("postPublish", (id, streamPath, args) => {
    console.log(
      "[NodeEvent on postPublish]",
      `id=${id} streamPath=${streamPath} args=${JSON.stringify(args)}`
    );
  });

  nms.on("doneConnect", (id, args) => {
    console.log(
      "[NodeEvent on doneConnect]",
      `id=${id}  args=${JSON.stringify(args)}`
    );
  });

  nms.run();
};

export default rtmpServer;
