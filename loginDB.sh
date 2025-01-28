#!/usr/bin/env bash
source ./.env
ignored_protocol=${DATABASE_URL#*mysql://}

IFS="/"
read -a array <<< "$ignored_protocol"
IFS="@"
read -a array2 <<< "${array[0]}";

array2+=("${array[1]}");


IFS=":"
read -a array3 <<< "${array2[0]}";


array3+=("${array2[@]:1:2}");

IFS=":"
read -a host <<< "${array3[2]}"
unset IFS;
mysql -u "${array3[0]}" --password="${array3[1]}" -h "${host[0]}" "${array3[3]}" 
