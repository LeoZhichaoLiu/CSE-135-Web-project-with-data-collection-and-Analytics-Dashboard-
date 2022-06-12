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
  <title>Reporting - Idle</title>
  <link rel="stylesheet" href="/hw4/index.css">
  <script src="https://cdn.zingchart.com/zingchart.min.js"></script>
  <script src="https://cdn.zinggrid.com/zinggrid.min.js" defer></script>
  <script src="idle-report.js"></script>
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
    <h2>How Long Are People on Our Website and How Much of That Time Is Spent Idle?</h2>
    <p>
      <strong>NOTE: </strong>
      Total times are calculated by finding the difference in time between 
      the load timestamp and the unload timestamp. The idle times are collected
      via the collecter as is. The active times are the difference between the
      total time spent and the idle time. a user is considered idle after 2 
      seconds of no input (the idle time includes these two seconds)
    </p>
    <section>
      <h3>Introduction</h3>
      <p> 
        The reason why we believe this would be an important metric to keep track
        of is twofold. For starters, we would want to know how engaging our
        website is to users, so we would want to see not only how much of their
        time is spent on the website, but also how much of that time is spent
        actively. This means that we should not only track how long they were
        on the website but also for how long they were <strong>active</strong>
        on the website. The second reason is to check for unusual activity, notably
        from bots or possible attempts at creating fake traffic. The way we
        would detect this is twofold. For starters, we would track how many
        people are only staying on our website for less than a second. Most
        people would stay on our website for at least a second. Even if they are
        uninterested in our website or anything it has to offer, they would at
        least look for a small moment and then leave, but to leave almost as
        soon as you enter is uncommon. It could be entirely possible for someone
        to refresh the page and load the script multiple times which would
        replicate this, but usually, people rapidly refresh the page if the page
        is slow to load, which if that is the case, the script for load and
        unloading would not load and therefore the data would not go through
        as valid. This means that if we note a large number of people entering
        and exiting the site within a second, while we cannot say that they are
        all bots, we can at least have some suspicion if there is a high volume.
        Another thing to check out for is possibly bots that land on the
        website and then idle to feign traffic and long engagement. With this
        possibility, we would need to check for people who go onto the website
        and then idle for an extremely long amount of time. Granted some people
        may idle on our site by leaving it in the background and forgetting to
        exit out, so that does not mean all events of this nature are from a
        bot, but again if we see it in high volume, it will allow us to raise
        suspicion.
      </p>
    </section>
    <section>
      <h3>Data</h3>
      <figure id="timeGraph">
      </figure>
      <figure id="idleRatio">
      </figure>
      <zing-grid id="load-grid" caption="Load Activity Data" sort search pager page-size="10" page-size-options="10,20,30" layout="row" viewport-stop>
      </zing-grid>
    </section>
    <section>
      <h3>Analysis</h3>
      <p>
        First looking at the user counts in terms of how they spent their time
        on the website, we can see that 12 of the 56 users spent less than a
        second on the website, which isn't an especially high number. This could
        be based on people who quickly refreshed the page right after the page
        loaded. While this could be bots, it simply isn't too high of
        a percentage of users for there to be a major concern. Additionally, of
        the 56 users who entered the website, only 10 spent 16 spent time
        idle, which sounds pretty good. Only 4 people were AFK for more
        than a minute. However, it seems that a majority of our userbase stays
        active on our website for only a minute a most. Only 6 users 
        stayed active on our page for longer than a minute and only 2 for longer
        than 2 minutes. However, to some extent this makes sense. This is
        because the website being tracked does not have anything particularly
        interesting on it, and acts rather as a gateway to other more
        interesting pages which are not tracked. One must wonder what
        type of person would enter a website that is an over-glorified navigation
        hub and remain active for well over 6 minutes.  Granted these are
        non-consecutive so it could have been the case they were browsing the
        navigation, entered one of the pages via a new tab, and would return
        afterward to look at other pages. So in this example, there would be
        some moments of activity followed by moments of inactivity followed 
        again by moments of activity. In this case, would say that
        having a fair amount of activity and inactivity could show signs of our
        main page serving its purpose. Looking at the 2nd graph, we can see that
        this sentiment is partially justified, in that about 71% of time spent 
        on the website is active and the other 29% is spent inactive. This could
        be because users start active and are looking through links.
        Then they go to the link through a new tab and remain inactive on the
        main site while they peruse the other page. When they finish they would
        exit the main page and go back to the old one, in which case they would
        most likely become active again.
      </p>
    </section>
  </main>
  <footer>
    <p>A simple page for CSE 135 made with ♥ by Young Kim, Zhichao Liu and Chad Wall</p>
  </footer>
</body>
</html>