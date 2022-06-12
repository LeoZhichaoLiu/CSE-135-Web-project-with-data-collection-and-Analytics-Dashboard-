<?php
session_start();
if(isset($_SESSION['auth']) && $_SESSION['auth'] == true) {
    header("Location: /hw4/index.php");
    exit();
}
$error = "";
$username = "";

if($_SERVER["REQUEST_METHOD"] == "POST") {
    if(empty(trim($_POST["username"]))) {
        $error = "Enter your username";
    } else {

        //DB constants
        $host = "127.0.0.1";
        $server_username = "auth";
        $server_password = "A&e@1RbTU2yIz!:LOm!j";
        $database = "user";
        $username = trim($_POST["username"]);

        //conect to mysql database
        $conn = mysqli_connect($host, $server_username, $server_password, $database);

        // Exit if failed
        if(!$conn) {
            die("Connection failed: " . mysqli_connect_error());
        }

        // Prepared statement
        $queryUsername = "SELECT * FROM user WHERE email = ? OR username = ?;";
        $stmt = mysqli_stmt_init($conn);
        
        // Make sure its a valid query
        if(!mysqli_stmt_prepare($stmt, $queryUsername)) {
            $error = "Username or password incorrect";
        } else {
            // Execute the query
            mysqli_stmt_bind_param($stmt, "ss", $username, $username);
            mysqli_stmt_execute($stmt);
            
            // Get the result of query
            $result = mysqli_stmt_get_result($stmt);

            // Store the result in an array
            if($userdata = mysqli_fetch_assoc($result)) {
                mysqli_stmt_close($stmt);

                $salt = $userdata["salt"];
                $hashedPassword = hash_pbkdf2("sha512", $_POST["password"], $salt, 120000, 64, true);
                $hashedPassword = base64_encode($hashedPassword);


                // Verify info
                if(!isset($userdata["email"]) || $userdata["password"] != $hashedPassword) {
                    $error = "Username or password incorrect";
                } else {
                    $_SESSION["username"] = $username;
                    $_SESSION["auth"] = true;
                    $_SESSION["admin"] = $userdata["type"];

                    header("Location: /hw4/index.php");
                    exit();
                }
            } else {
                $error = "Username or password incorrect";
                mysqli_stmt_close($stmt);
            }
        }        
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel = "icon" href = "/images/favicon.png">
    <title>Reporting - Login</title>
    <link rel="stylesheet" href="index.css">
</head>
<body>
  <header>
    <h1>CSE 135 - ChadJunLeo - Reporting</h1>
  </header>
  <main>
    <h2>Login Page</h2>
    <div id="login-container">
        <h3>Please log in here</h3>
        <p class="err"><?= $error; ?></p>
        <form action="login.php" method="POST">
        <label for="username">Username (or email address): </label><br>
        <input type="text" id="username" name="username" value="<?= $username; ?>"><br>
        <label for="password">Password: </label><br>
        <input type="password" id="password" name="password"><br><br>
        <input type="submit" value="Log In" id="login-btn">
        </form>
    </div>
  </main>
  <footer>
    <p>A simple page for CSE 135 made with ♥ by Young Kim, Zhichao Liu and Chad Wall</p>
  </footer>
</body>
</html>