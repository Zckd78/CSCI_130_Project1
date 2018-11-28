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
        $this->sqlConnection = new mysqli("localhost","root","","picross");

        // Check for errors
        if ($this->sqlConnection->connect_errno)
        {
            die("Failed to connect to MySQL: (" . $this->sqlConnection->connect_errno . ") " . $this->sqlConnection->connect_error);
        }
    }

    // Contructor to Connect to the Database
    function __construct() {
        $this->Connect();
    }

    private function CloseConnection(){
        $this->sqlConnection->close();
    }

    // Return True if successful, else false
    public function RunSingleQuery($query){
        $result = $this->sqlConnection->query($query);
        return $result;
    }

    public function RunMultiQuery($query){
        $result = $this->sqlConnection->multi_query($query);
        return $result;
    }


    //
    public function Execute($query){
        // Run the Query
        $this->queryResults = $this->sqlConnection->query($query);
        if(!$this->queryResults){
            die("Error in query!");
        } else {
            $this->queryExecuted = true;
        }
    }


    public function GetNumRows(){
        return $this->queryResults->num_rows;
    }

    // Returns a single row of the results
    public function FetchRow(){
        if($this->queryResults->num_rows > 0){
            $this->queryResults->data_seek(0);
            return $this->queryResults->fetch_assoc();
        }
    }


    // Returns the rows
    public function ReturnQueryRows($query){

        // Run the Query
        $this->queryResults = $this->sqlConnection->query($query);
        if(!$this->queryResults){
            die("Error in query!");
        };

        // Create an array to store the results
        $rows = Array($result->num_rows);
        $i = 0;
        while ($row = $res->fetch_assoc()) {
            $rows[$i] = $row;
            $i = $i + 1;
        }

        // Return the array
        return $rows;

    }

} // End of Class SQLConnector

?>
