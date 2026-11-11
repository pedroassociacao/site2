<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
$arquivo = __DIR__ . '/downloads-revista.txt';
$total = 0;
if (is_file($arquivo)) {
    $conteudo = trim((string) file_get_contents($arquivo));
    if ($conteudo !== '' && ctype_digit($conteudo)) $total = (int) $conteudo;
}
echo json_encode(['total' => $total], JSON_UNESCAPED_UNICODE);
