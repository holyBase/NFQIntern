<?php

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");

include_once('../core/initialize.php');

$project = new Project($db);

$result = $project->read();

$num = $result->rowCount();

if ($num >= 0) {
    $project_arr = array();
    $project_arr['data'] = array();

    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $project_item = array(
            'project_id' => $project_id,
            'project_name' => $project_name,
            'number_of_groups' => $number_of_groups,
            'students_per_group' => $students_per_group
        );
        array_push($project_arr['data'], $project_item);
    }
    echo json_encode($project_arr);
    
} else {
    echo json_encode(array('Message' => 'No Projects found'));
}
