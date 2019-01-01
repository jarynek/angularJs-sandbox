<?php
/**
 * Created by PhpStorm.
 * User: Jarek
 * Date: 2018-12-31
 * Time: 15:46
 */

if(isset($_GET['tasks'])){
    include_once 'tasks.html';
}else{
    include_once 'homepage.html';
}