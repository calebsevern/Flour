<!doctype html>
<html>
  <head>
    <link rel="stylesheet" href="home/styles.css">
    <script src="js/jquery.2.1.3.min.js"></script>
    <script src="js/db.js"></script>
    <script src="home/script.js"></script>
  </head>
      
  <div class="data-table-wrapper">
    <div class="utility-header">
      <button class="action-button create-object">+ Row</button>
      <button class="action-button destroy-object">- Row</button>
      <button class="action-button destroy-class">Drop Class</button>
    </div>
  
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr class="class-attributes">
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    </div>
    
    <div class="utility-footer">
      <div class="server-response">
        Waiting for instructions...
      </div>
    </div>
    
    <!--Loading overlay for data table-->
    <div class="loading-overlay"></div>
  </div>
  
  <div class="nav">
    <div class="tab add-class">Add Class</div>
    <div class="classes-list">
      <div class="classes"></div>
    </div>
  </div>
  
  <div class="top-nav">
    <div class="left-menu">
    </div>
    <div class="center-menu">
      <span>
        <a href="index.php">Data</a>
      </span>
      <!--<span>
        <a href="settings.php">Settings</a>
      </span>-->
    </div>
  </div>
  
</html>