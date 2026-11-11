<?php
$revista = __DIR__ . '/revista.pdf';
if (!is_file($revista)) {
    http_response_code(404);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'A revista ainda não foi publicada. Adicione o arquivo revista.pdf à pasta do site.';
    exit;
}
$contador = __DIR__ . '/downloads-revista.txt';
$fp = fopen($contador, 'c+');
if ($fp === false) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Não foi possível registrar o download neste momento.';
    exit;
}
if (flock($fp, LOCK_EX)) {
    $atual = stream_get_contents($fp);
    $total = (is_string($atual) && trim($atual) !== '' && ctype_digit(trim($atual))) ? (int) trim($atual) : 0;
    $total++;
    rewind($fp);
    ftruncate($fp, 0);
    fwrite($fp, (string) $total);
    fflush($fp);
    flock($fp, LOCK_UN);
}
fclose($fp);
header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="revista-aeanp.pdf"');
header('Content-Length: ' . filesize($revista));
header('X-Content-Type-Options: nosniff');
readfile($revista);
