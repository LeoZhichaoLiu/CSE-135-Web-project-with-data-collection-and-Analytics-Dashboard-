<?php
session_start();
if(!isset($_SESSION['auth']) || $_SESSION['auth'] !== true) {
    header("Location: /hw4/login.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Browser-loading time report</title>
  <link rel = "icon" href = "../../images/favicon.png">
  <script src="https://cdn.zingchart.com/zingchart.min.js"></script>
  <script src="https://cdn.zinggrid.com/zinggrid.min.js" defer></script>
  <script src="browser-report.js"></script>
  <link rel="stylesheet" href="/hw4/index.css">
  <style>
      h2, p{
        text-align: center;
      }
  </style>
</head>
<body>
<header>
    <h1>CSE 135 - ChadJunLeo - Reporting</h1>
    <nav>
      <ul id="navbar">
        <li><a href="/hw4/index.php">Reporting Dashboard</a></li>
        <?php 
          if($_SESSION["admin"] === "A") {
            echo "<li><a href='/hw4/users.php'>User Management</a></li>";
          }
        ?>
        <li><strong>Reports</strong></li>
        <li><a href="/hw4/logout.php">Logout</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <h2>Question: Which browser has the shortest loading time among users? </h2>
    <p>First, we extract the raw loading time data for each browser, and calculate the average time. </p> 
    <p>The grid and chart are generated below: </p> 
    <zing-grid id="browser-grid" caption="Each Browser's loading time" sort search pager page-size="10" page-size-options="10,20,30" layout="row" viewport-stop></zing-grid>
    <figure id = "browser-load"></figure>
    <h2>Disscussion about outlier</h2>
    <p> From above data, we can see there are lots of outlier that hugely affect the average time. </p>
    <p> For example in Chrome browser, the loading time of 53973 ms is about 54s, which may due to <br> 
        network issue, rather than causing by different browser.</p>
    <p> So, in our plan, we will eliminate any loading time larger than 5000 ms, which is 5 seconds, <br> 
        in order to add constraints showing the real effect under browser's difference.</p>
    <p> And after we eliminate the outlier data from our loading time, we get the following results: </p>
    <h2> New Data after eliminating outlier</h2>

    <zing-grid id="browser-grid-modify" caption="Each Browser's loading time (eliminate outlier)" sort search pager page-size="10" page-size-options="10,20,30" layout="row" viewport-stop></zing-grid>
    <figure id = "browser-load-modify"></figure>

    <h2>Conclusion</h2>
    <p> After eliminate the outlier loading time due to network or system issue, we can see <br>
        both chrome and firefox has the average 350-500 ms loading time. And for comaprsion, <br> 
        chrome is relatively faster, with 366ms than 472ms, approximately 20% faster.</p>

    <p> The loading time for Safari is much shorter (84 ms), while it may due to the shortage of <br>
        data collected. For Opera and Edge, we don't collect the data, so they are not shown. </p>

    <p> In a nutshell, with enough data collected, Chrome is 20% faster than Firefox by loading time, <br>
        with enough data collected. And Safari is faster than them, but may caused by the bias <br> 
        of lacking data. </p>
  </main>
  <footer>
    <p>A simple page for CSE 135 made with ♥ by Young Kim, Zhichao Liu and Chad Wall</p>
  </footer>
</body>
</html>