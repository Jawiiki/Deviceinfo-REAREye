function run(){
	// 当前时间
    var now = new Date();
    var hh = ("0" + now.getHours()).slice(-2);
    var mm = ("0" + now.getMinutes()).slice(-2);
    var ss = ("0" + now.getSeconds()).slice(-2);
	var time = "更新时间：" + hh + ":" + mm + ":" + ss;
    uriRoute.add("time", hh + ":" + mm + ":" + ss);

    // CPU
    var preCpuinfo = uriRoute.getValue("preCpuinfo");
	var curCpuinfo = uriRoute.shell("awk '/^cpu / {print $2, $4, $5; exit}' /proc/stat");
	uriRoute.saveEnv("preCpuinfo",curCpuinfo);
	var cpu_usage;
	// 计算使用率
	{
		var c = curCpuinfo.trim().split(/\s+/);
		var curUser = +c[0];   // $2 user
		var curSys  = +c[1];   // $4 system
		var curIdle = +c[2];   // $5 idle
		if (preCpuinfo) {
			var p = preCpuinfo.trim().split(/\s+/);
			var preUser = +p[0];
			var preSys  = +p[1];
			var preIdle = +p[2];

			// 纯JS公式
			var deltaBusy = (curUser + curSys) - (preUser + preSys);
			var deltaTotal = (curUser + curSys + curIdle) - (preUser + preSys + preIdle);
			if (deltaTotal > 0) {
				usage = (deltaBusy * 100) / deltaTotal;
				cpu_usage = usage.toFixed(2) + "%";
			}
		}
		
	}
    // 内存

    var meminfo = uriRoute.shell("cat /proc/meminfo");
    var totalMem = 0, availMem = 0;
    meminfo.split("\n").forEach(function(line) {
        if (line.indexOf("MemTotal:") === 0) totalMem = parseFloat(line.replace(/[^0-9.]/g, ""));
        if (line.indexOf("MemAvailable:") === 0) availMem = parseFloat(line.replace(/[^0-9.]/g, ""));
    });
    


    // 存储
    var df = uriRoute.shell("df /data");
    var lines = df.trim().split("\n");
	var storage_used;
    for (var i = 1; i < lines.length; i++) {
        var cols = lines[i].trim().split(/\s+/);
        if (cols.length >= 5) {
            var usedKB = parseFloat(cols[2]);
            storage_used = (usedKB / 1024 / 1024).toFixed(1) + "GB";
            break;
        }
    }

    // 电压 + 电流 + 实时功耗

    var raw = uriRoute.shell("cat /sys/class/power_supply/battery/voltage_now /sys/class/power_supply/battery/current_now 2>/dev/null");
    var lines = raw.trim().split("\n");
	var vRaw = lines[0] || '0';
	var aRaw = lines[1] || '0';
	var vNum = parseFloat(vRaw.trim());
    var aNum = -1 * parseFloat(aRaw.trim());
	
	if(cpu_usage){
		uriRoute.add("title","设备资讯")
		uriRoute.add("tag",time)
		uriRoute.add("key1","CPU负载")
		uriRoute.add("value1",cpu_usage)
	}else{
		uriRoute.add("title","UriRoute未Root")
	}
    if (!isNaN(vNum) && vNum > 0) {
        var vVolts = (vNum / 1000000).toFixed(3);
		uriRoute.add("key2","电压");
        uriRoute.add("value2", vVolts + "V");
    }
	if (totalMem > 0) {
        var usedMem = totalMem - availMem;
		uriRoute.add("key3", "内存占用");
        uriRoute.add("value3", (usedMem / 1024 / 1024).toFixed(1) + "GB");
    }
    if (!isNaN(aNum) && aNum != 0) {
        var aAmps = (aNum / 1000000).toFixed(3);
		uriRoute.add("key4", "电流");
        uriRoute.add("value4", aAmps + "A");
    }
	if(storage_used){
		uriRoute.add("key5","存储空间");
		uriRoute.add("value5",storage_used);
	}
    if (!isNaN(vNum) && !isNaN(aNum) && vNum > 0) {
		uriRoute.add("key6", "功率");
        uriRoute.add("value6", ((vNum / 1000000) * (aNum / 1000000)).toFixed(3) + "W");
    }
}