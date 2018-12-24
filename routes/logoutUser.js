module.exports = app => {
  app.get("/api/logout", (req, res) => {
    console.log("NOW we LOGOUT");
    req.logout();
    // res.redirect("/");
  });
};
