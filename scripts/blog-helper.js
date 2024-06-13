const fs = require("fs");

// read each file from the ./blog directory and remove the date in the format of yyyy-MM-dd- from the filename
function readFilesAndRemoveDate() {
  fs.readdir("./content/blog", (err, files) => {
    if (err) {
      console.log(err);
    } else {
      files.forEach((file) => {
        let newFileName = file.replace("md", "mdx");
        fs.rename(
          `./content/blog/${file}`,
          `./content/blog/${newFileName}`,
          (err) => {
            if (err) {
              console.log(err);
            }
          },
        );
      });
    }
  });
}

readFilesAndRemoveDate();
