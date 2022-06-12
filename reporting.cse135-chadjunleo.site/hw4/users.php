<?php
session_start();
if(!isset($_SESSION['auth']) || $_SESSION['auth'] != true) {
    header('Location: /hw4/login.php');
    exit(); 
} else if ($_SESSION["admin"] !== "A") {
  header("Location: /hw4/home.php");
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
  <title>Reporting - User Management</title>
  <link rel="stylesheet" href="index.css">
  <script src="https://cdn.zinggrid.com/zinggrid.min.js" defer></script>
</head>
<body>
<header>
    <h1>CSE 135 - ChadJunLeo - Reporting</h1>
    <nav>
      <ul id="navbar">
        <li><a href="/hw4/index.php">Reporting Dashboard</a></li>
        <li><strong>User Management</strong></li>
        <li><a href="/hw4/reports.php">Reports</a></li>
        <li><a href="/hw4/logout.php">Logout</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <zing-grid editor-controls>
    </zing-grid>
  </main>
  <footer>
    <p>A simple page for CSE 135 made with ♥ by Young Kim, Zhichao Liu and Chad Wall</p>
  </footer>
</body>
<script>
  <?php
    $ch = curl_init(); 
    curl_setopt($ch, CURLOPT_URL, "localhost:5000/user"); 
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
    $result = curl_exec($ch);
  ?>
  let usersRaw = '<?php echo $result; ?>';
</script>
<script src="users.js"></script>
</html>