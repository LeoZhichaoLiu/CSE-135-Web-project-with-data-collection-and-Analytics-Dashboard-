<?php
session_start();
if(!isset($_SESSION['auth']) || $_SESSION['auth'] != true) {
    header('Location: login.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reporting - Dashboard</title>
  <link rel = "icon" href = "/images/favicon.png">
  <script src="https://cdn.zingchart.com/zingchart.min.js"></script>
  <script src="https://cdn.zinggrid.com/zinggrid.min.js" defer></script>
  <link rel="stylesheet" href="index.css">
  <script src="index.js"></script>
  <style>
    main {
      display: grid;
      grid-template-areas: 
        "welcome welcome welcome welcome welcome welcome"
        "today today week week total total"
        "clicks clicks clicks settings settings settings"
        "browser browser browser os os os"
        "load load load load load load"
        "load-grid load-grid load-grid load-grid load-grid load-grid ";
    }
    
    .welcome {
      grid-area: welcome;
    }

    .visit {
      text-align: center;
    }

    #today {
      grid-area: today;
    }

    #week {
      grid-area: week;
    }

    #total {
      grid-area: total;
    }

    #series3Line {
      grid-area: clicks;
    }

    #series2Bar {
      grid-area: settings;
    }

    #browser {
      grid-area: browser;
    }

    #pie {
      grid-area: os;
    }

    #load {
      grid-area: load;
    }
    
    #load-grid {
      grid-area: load-grid;
    }
  </style>
</head>

<body>
  <header>
    <h1>CSE 135 - ChadJunLeo - Reporting</h1>
    <nav>
      <ul id="navbar">
        <li><strong>Reporting Dashboard</strong></li>
        <?php 
          if($_SESSION["admin"] === "A") {
            echo "<li><a href='/hw4/users.php'>User Management</a></li>";
          }
        ?>
        <li><a href="/hw4/reports.php">Reports</a></li>
        <li><a href="/hw4/logout.php">Logout</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <section class="welcome">
      <h2>Welcome, <?= $_SESSION['username']; ?>!</h2>
      <time></time>
      <a href="reports.php">Click here to see reports</a>
    </section>
    <section class="visit" id="today">
      <h2>Today's Visitors: </h2> 
      <p id="users-num1"></p>
    </section>
    <section class="visit" id="week">
      <h2>Past week's Visitors</h2>
      <p id="users-num2"></p>
    </section>
    <section class="visit" id="total">
      <h2>Total's Visitors</h2>
      <p id="users-num3"></p>
    </section>
    <figure id="series3Line"></figure>
    <figure id="series2Bar"></figure>
    <figure id="browser"></figure>
    <figure id="pie"></figure>
    <figure id="load"></figure>
    <zing-grid id="load-grid" caption="Load Activity Data" sort search pager page-size="10" page-size-options="10,20,30" layout="row" viewport-stop></zing-grid>
  </main>
  <footer>
    <p>A simple page for CSE 135 made with ♥ by Young Kim, Zhichao Liu and Chad Wall</p>
  </footer>
  <script>document.querySelector('time').textContent = new Date();</script>
</body>

</html>
