<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "news_user_test";
$password = "123";
$dbname = "news_beacon_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Ошибка подключения: " . $conn->connect_error);
}

$email = $_POST['email'];
$category = $_POST['category'];

$stmt = $conn->prepare("INSERT INTO subscribers (email, category) VALUES (?, ?) ON DUPLICATE KEY UPDATE category = VALUES(category)");
$stmt->bind_param("ss", $email, $category);

if ($stmt->execute()) {
    echo "Подписка успешно оформлена!";
} else {
    echo "Ошибка при подписке: " . $conn->error;
}

$stmt->close();
$conn->close();
?>
