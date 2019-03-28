param([string]$cmd)

$compose = "docker-compose -f .\docker-compose.yml -f .\docker-compose-dev.yml $cmd"
Invoke-Expression $compose
