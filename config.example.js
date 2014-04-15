module.exports = function() {
  switch (process.env.NODE_ENV) {

  case "development":
  default:
    return {
      rsync: {
        dest: "<user>@<ip>:<path>"
      }
    };

  }
};