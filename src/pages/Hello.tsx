import Grid from "@mui/material/Grid";
import React from "react";

function Hello() {
  return (
    <Grid
      container
      component="main"
      sx={{ height: "100vh", width: "100vw" }}
      spacing={2}
    >
      <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
        <div className="w-full h-full border-red-500 border-2"></div>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
        <div className="w-full h-full border-blue-500 border-2"></div>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
        <div className="w-full h-full border-orange-500 border-2"></div>
      </Grid>
    </Grid>
  );
}

export default Hello;
