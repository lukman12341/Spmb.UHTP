<?php
echo "EXAM_RESULTS:\n";
echo json_encode(Schema::getColumnListing('exam_results'));
echo "\nREGISTRATIONS:\n";
echo json_encode(Schema::getColumnListing('registrations'));
echo "\nBIODATAS:\n";
echo json_encode(Schema::getColumnListing('biodatas'));
echo "\n";
