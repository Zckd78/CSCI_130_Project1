<?php

/**
 * 
 */
class SQLConnector 
{
    // Our connection to the database
    private $sqlConnection;

    // Track if a query was run
    private $queryExecuted = false;

    // Results of the last query
    public $queryResults;

    // Connects to the database
    private function Connect(){
        
        // Create the Connection
        $this->sqlConnection = new mysqli("localhost","root","","csci130_team20");

        // Check for errors
        if ($this->sqlConnection->connect_errno)
        {
            die("Failed to connect to MySQL: (" . $this->sqlConnection->connect_errno . ") " . $this->sqlConnection->connect_error);
        }
    }

    private function CloseConnection(){
        $this->sqlConnection->close();
    }

    // Contructor to Connect to the Database
    function __construct() {
        $this->Connect();
    }

    // Destructor
     function __destruct() {
        $this->CloseConnection();
    }


    // Executes the query, and stores the results in the class
    public function Execute($query){
        // Run the Query
        $this->queryResults = $this->sqlConnection->query($query);
        if(!$this->queryResults){
            die("Error in query!");
        } else {
            $this->queryExecuted = true;
        }
    }

    public function GetResults(){
        return $this->queryResults;
    }

    public function GetNumRows(){
        return $this->queryResults->num_rows;
    }

    // Returns a single row of the results
    public function FetchRow($rowNum){
        // If we have at least one row
        if($this->queryResults->num_rows > 0){
            // Seek the data
            $this->queryResults->data_seek($rowNum);
            // Fetch the object
            return $this->queryResults->fetch_assoc();
        }
    }


    // Returns the rows
    public function FetchAllRows(){
        // If we have at least one row
        if($this->queryResults->num_rows > 0){
            
            $rows = array($this->queryResults->num_rows);
            // Seek the data
            $this->queryResults->data_seek(0);
            $i = 0;
            while($row = $this->queryResults->fetch_assoc() ){
                $rows[$i] = $row;
                $i++;
            }
            return $rows;
        }

    }


} // End of Class SQLConnector

?>
