<?php
  session_start();
  
  if(isset($_SESSION['auth']) && $_SESSION['auth'] == true && $_SESSION["admin"] === "A") {
    
    header('Content-Type: application/json');
    
    switch ($_SERVER["REQUEST_METHOD"]) {
      case "POST":
        $requestBody = [];
        $requestBody['email'] = $_POST['email'];
        $requestBody['username'] = $_POST['username'];
        $requestBody['password'] = $_POST['password'];
        $requestBody['type'] = $_POST['type'];
        $ch = curl_init(); 
        curl_setopt($ch, CURLOPT_URL, "localhost:5000/user");
        curl_setopt($ch, CURLOPT_POST, 1); 
        curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json"));
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestBody));
        $response = curl_exec($ch);
        echo $response;
        break;
      case "PUT":
        $putBody = explode("&", file_get_contents('php://input'));
        $requestBody = [];
        foreach($putBody as $item) {
          $parts = explode("=", $item);
          $requestBody[$parts[0]] = $parts[1];
        }
        $ch = curl_init(); 
        curl_setopt($ch, CURLOPT_URL, "localhost:5000/user/".$requestBody["old_email"]);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
        curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json"));
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestBody));
        $response = curl_exec($ch);
        echo $response;
        break;
      case "DELETE":
        $putBody = explode("=", file_get_contents('php://input'));
        $requestBody = [];
        $requestBody[$putBody[0]] = $putBody[1];
        $ch = curl_init(); 
        curl_setopt($ch, CURLOPT_URL, "localhost:5000/user/".$requestBody["email"]);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
        curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json"));
        $response = curl_exec($ch);
        echo json_encode($response);
        break;
      default:
        break;
    }

  } else {
    
    http_response_code(403);
    
    echo 'Not Allowed!';
  }
  
  
?>