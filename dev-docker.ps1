param(
    [ValidateSet('start','stop','status','logs','restart')]
    [string]$Action = 'start'
)

$Image = 'tree-explorer-dev'
$Name  = 'tree-explorer-dev'
$HostPort = 5173

# Resolve current folder for bind mount (PowerShell returns a Path object)
$PwdPath = (Get-Location).Path

switch ($Action) {
    'start' {
        Write-Host "Starting container '$Name' from image '$Image'..."
        # Remove any stopped container with same name to avoid conflicts
        docker rm -f $Name 2>$null | Out-Null

        # Run detached, restart unless stopped, bind mount repo and node_modules volume
        docker run -d --name $Name --restart unless-stopped -p $HostPort:5173 -v ${PWD}:/app -v /app/node_modules $Image npm run dev -- --host 0.0.0.0 | Out-Null

        Start-Sleep -Seconds 1
        Write-Host "Container started. Following logs (press Ctrl+C to detach)..."
        docker logs -f $Name
    }

    'stop' {
        Write-Host "Stopping and removing container '$Name'..."
        docker stop $Name 2>$null | Out-Null
        docker rm $Name 2>$null | Out-Null
        Write-Host 'Stopped.'
    }

    'status' {
        docker ps --filter name=$Name --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    }

    'logs' {
        docker logs -f $Name
    }

    'restart' {
        Write-Host 'Restarting container...'
        docker stop $Name 2>$null | Out-Null
        docker rm $Name 2>$null | Out-Null
        Start-Sleep -Seconds 1
        docker run -d --name $Name --restart unless-stopped -p $HostPort:5173 -v ${PWD}:/app -v /app/node_modules $Image npm run dev -- --host 0.0.0.0 | Out-Null
        Start-Sleep -Seconds 1
        docker logs -f $Name
    }

    Default {
        Write-Host "Unknown action: $Action. Valid actions: start, stop, status, logs, restart"
    }
}
