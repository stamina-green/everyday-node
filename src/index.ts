import * as http from "http"
import * as fs from "fs"
import { URL } from "url"

http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Max-Age', 2592000); // 30 days
    
    console.log(req.url);
    let parsed = new URL("https://everytime.stamina.green" + req.url || "")
    const dates = parsed.searchParams.get("dates") || "[]"
    const user = parsed.searchParams.get("user") || ""
    const activityName = parsed.searchParams.get("activity") || ""

    const data = JSON.parse(fs.readFileSync("./src/data.json").toString());


    if (parsed.pathname === "/add") {
        console.log(activityName);
        console.log(data.calendars);


        if (!data.calendars[activityName]) data.calendars[activityName] = []
        data.calendars[activityName].push([user, JSON.parse(dates)])
        console.log(data.calendars[activityName]);

        fs.writeFileSync("./src/data.json", JSON.stringify(data))
        return pong("Added", res)
    }

    if (parsed.pathname === "/get") {
        if (!data.calendars[activityName]) return pong("Activity not found", res)
        let dateArr: string[] = data.calendars[activityName][0][1]

        data.calendars[activityName].forEach((person: any) => {
            const dateTempor: string[] = []
            person[1].forEach((date: string) => {
                if (dateArr.includes(date)) {
                    dateTempor.push(date)
                }
            })
            console.log(dateTempor);

            dateArr = dateTempor
        });
        return pong(JSON.stringify({ all: data.calendars[activityName], community: dateArr }), res);

    }

    return pong("No action mandated  ", res)

}).listen(3000)

function pong(string: string, res: http.ServerResponse) {
    console.log(string);
    res.end(string)

}
