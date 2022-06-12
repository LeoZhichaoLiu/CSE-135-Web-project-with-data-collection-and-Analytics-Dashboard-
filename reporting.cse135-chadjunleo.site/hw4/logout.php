<?php
session_start();
$wasLoggedIn = false;
if(isset($_SESSION['auth']) && $_SESSION['auth'] == true) {
  $wasLoggedIn = true;
}
$_SESSION = array();
session_destroy();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel = "icon" href = "/images/favicon.png">
  <title>Reporting - Logout</title>
  <link rel="stylesheet" href="index.css">
</head>
<body>
  <header>
    <h1>CSE 135 - ChadJunLeo - Reporting</h1>
    <nav>
      <ul id="navbar">
        <li><a href="/hw4/login.php">Login</a></li>
      <ul>
    <nav>
  </header>
  <main>
    <h2>
      <?php
        if($wasLoggedIn) {
          echo "Logged out successfully!";
        } else {
          echo "Already logged out!";
        }
      ?>
    </h2>
  </main>
  <footer>
    <p>A simple page for CSE 135 made with ♥ by Young Kim, Zhichao Liu and Chad Wall</p>
  </footer>
</body>
</html>