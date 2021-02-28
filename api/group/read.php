<?php

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");

include_once('../core/initialize.php');

$group = new Group($db);

$result = $group->read();

$num = $result->rowCount();

if ($num >= 0) {
    $group_arr = array();
    $group_arr['data'] = array();

    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $group_item = array(
            'group_id' => $group_id,
            'project_name' => $project_name,
            'students_per_group' => $students_per_group,
        );
        array_push($group_arr['data'], $group_item);
    }
    echo json_encode($group_arr);
    
} else {
    echo json_encode(array('Message' => 'No Groups found'));
}