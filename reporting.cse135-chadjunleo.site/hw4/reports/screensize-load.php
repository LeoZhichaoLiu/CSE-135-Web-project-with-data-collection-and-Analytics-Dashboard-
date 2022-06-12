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
  <title>Correlation between screen size and network report</title>
  <link rel = "icon" href = "../../images/favicon.png">
  <script src="https://cdn.zingchart.com/zingchart.min.js"></script>
  <script src="https://cdn.zinggrid.com/zinggrid.min.js" defer></script>
  <script src="screensize-load-report.js"></script>
  <link rel="stylesheet" href="/hw4/index.css">
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
    <section>
      <h2>Question: Is there a correlation between screen size and load time? </h2>
      <p>
        First, we must create a one to one relationship between the timestamps of
        both the screen sizes and the load times. This will allow us to create a 
        data structure, where the screen sizes will be keys and the load times will
        be values. Due to differences in the REST API end points, we must take the 
        minimum length of the JSON objects of performance and static. Additionally,
        we can filter the data for loadtimes that don't make sense like -1.
      </p>
    </section> 
    <p>The grid and chart are generated below: </p> 
    <zing-grid id="screensize-loadtimes" caption="Load times of each screen resolution" sort search pager page-size="10" layout="row" viewport-stop></zing-grid>
    <section>
      <p>
        As seen above, there seems to be some outliers. However these need to be
        carefully analyzed. Larger screen sizes indicate that the device is most likely
        a desktop or the user is at home, which tend to have faster connections compared to mobile devices.
        Additionally, there are other outliers that may indicate network issues that
        the user is facing from their service provider. Keeping these in ideas in mind,
        we can do the following to the data.
        <ul>
          <li>
            For the 2560 x 1440 resolution, we can safely ignore all load values above 6000.
            Althought 2560 x 1440 resolution mobile devices exist, they only account
            for a every small pool of devices.
          </li>
          <li>
            For the 1920 x 1080 resolution, we can safely ignore all load values above 10000.
            This is because 1920 x 1080 is a resolution that is used for both laptops and desktop,
            so somewhat high load times are resonable considering network conditions.
          </li>
          <li>
            For the 1440 x 900 resolution, we can follow the same idea as 1920 x 1080.
            Macbooks can be used at home and outside, so slow connections can be normal.  
          </li>
        </ul>
      </p>
    </section>
    <p>With these changes, we can filter the data as shown below</p>
    <zing-grid id="screensize-loadtimes-filtered" caption="Load times of each screen resolution" sort search pager page-size="10" layout="row" viewport-stop></zing-grid>
    <figure id="screen-size-graph"></figure>
    <h3>Analysis</h3>
      <p>
        By looking at the bar graph, we can see some obvious results that were expected, 
        and results that were unexpected. For the 360 x 760, a load time of 
        10212 is somewhat expected and unexpected at that same time. This resolution
        indicates that the device is a mobile device, so its possible that there
        is wide range of load times. If the user is on 4g or lower, then the current
        data shown is expected. Additionally, if the user is using a old phone, then
        the speed would also be valid because it will be throttled by compute
        speed. However, since there is only one data point, it is hard to make 
        any concrete observations. This same observations can be made about the
        834 x 1194 resolution. This resolution is a tablet resolution, so there is
        also a wide range of speeds. In this case, it seems like the tablet
        was mostly used in a location with decently fast speeds. For the 
        1440 x 900 and 1920 x 1080 resolutions, their speeds are similar. These
        speeds make sense because these resolutions are laptop and desktop screens. This means that 
        they can be used in locations with both really fast speeds or somewhat slow speeds.
        For the 2560 x 1440, we can make the same assumption that the device is being 
        used at home since its a very large display. In this case, it seems like this
        device is exclusively being used at home because of its lower speeds. However,
        if the device is suffering from poor speeds, then it will most likely result in similar data
        to the 1920 x 1080 and 1440 x 900 resolutions. This is because these resolutions have
        really lower speeds as well, but the average is higher due to the devices being
        used in areas with poor speeds.
      </p>
  </main>
  <footer>
    <p>A simple page for CSE 135 made with ♥ by Young Kim, Zhichao Liu and Chad Wall</p>
  </footer>
</body>
</html>