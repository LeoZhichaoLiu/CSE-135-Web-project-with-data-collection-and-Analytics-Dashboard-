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
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel = "icon" href = "/images/favicon.png">
  <title>Reporting - Reports</title>
  <link rel="stylesheet" href="index.css">
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
    <h2>List of Reports</h2>
    <ul>
      <li><a href="/hw4/reports/browser-load.php">Which Browser Has the Fastest Average Loading Times Among Users?</a></li>
      <li><a href="/hw4/reports/idle-report.php">How Long Are People on Our Website and How Much of That Time Is Spent Idle?</a></li>
      <li><a href="/hw4/reports/screensize-load.php">Is There a Correlation Between Screen Size and Load Time?</a></li>
    </ul>
  </main>
  <footer>
    <p>A simple page for CSE 135 made with ♥ by Young Kim, Zhichao Liu and Chad Wall</p>
  </footer>
</body>
</html>