import data from "../assets/participants.json" with { type: "json" };

class Shell {
    allowedCommands: string[];
    username: string;
    servername: string;
    groupname: string;
    uid: number;
    gid: number;
    files: Map<string, string> = new Map([
        [".", "cat: .: Is a directory"],
        ["..", "cat: ..: Is a directory"],
        [".flag.txt", "kn1ghts{Y0u_@R3_W3lc0me!}"],
        ["about.txt", "Small russian CTF team. Founded in 2024."], 
        ["logo.png", "Cannot display binary data"],
        ["M43s7r0.txt", this.readInfo("M43s7r0.")],
        ["Walter.txt", this.readInfo("Walter White")],
        ["Sascena.txt", this.readInfo("sascena")],
        ["Ada.txt", this.readInfo("Ada Ruby")],
        ["Lorraine.txt", this.readInfo("Lorraine")],
    ]);
    constructor() {
        this.username = "guest";
        this.groupname = "guest";
        this.uid = 1001;
        this.gid = 1001;
        this.servername = "kn1ghts";
        this.allowedCommands = ["help", "neofetch", "pwd", "cat", "ls", "echo", "whoami", "id", "clear", "exit"]
    }

    private readInfo(nick: string): string {
        const member = data.filter((d) => d.nick === nick)[0]
        return `Nickname: ${member.nick}\nRoles: ${member.role}\nTags: ${member.tags}\nGithub account: ${member.github}`
    }

    private getFilePrefix(filename: string): string {
        return `-rw-r--r-- 1 ${this.username} ${this.groupname} ${(filename === "." || filename === "..") ? "4096" : this.files.get(filename)?.length} Feb 14 13:37 `
    }

    // TODO: Need later
    // private parseFlags(command: String): Array<string> {
    //     let result: string[] = [];
    //     command.split(" ").map((res) => {
    //         result.push(res)
    //     })

    //     return result;
    // }

    test()  {
        return this.files;
    }

    getPrefix(): string {
        return `${this.username}@${this.servername}:~$ `
    }

    help(): string {
        const response: string = `You are able to use only the following commands:\n${this.allowedCommands.join("\n")}`
        return response;
    }

    pwd(): string {
        return "/";
    }

    ls(flags?: string[]): string {
        const keysIterator = this.files.keys()
        const detailed: boolean = flags?.includes("l") ? true : false;
        const showHidden: boolean = flags?.includes("a") ? true : false;
        const separator: string = detailed ? "\n" : " ";

        let response: string[] = new Array<string>();
        for (const key of keysIterator) {
            
            let line: string;
            if (detailed) {
                line = this.getFilePrefix(key);
            } else {
                line = ""
            }
            if (key.startsWith(".") && showHidden) {
                line = line.concat(key)
            } else if (key.startsWith(".") && !showHidden) {
                continue;
            } else {
                
                line = line.concat(key);
            }
            response.push(line);
        }
        return response.join(separator);
    }

    cat (files: string[]): string {
        let response: string[] = new Array<string>();
        files.forEach((file) => {
            const content = this.files.get(file);
            if (content) {
                response.push(content);
            }
            else {
                response.push(`cat: ${file}: No such file or directory`);
            }
        })
        
        return response.join("\n");
    }

    echo(text: string): string {
        return text;
    }

    whoami(): string {
        return this.username;
    }

    id(): string {
        return `uid=${this.uid}(${this.username}) gid=${this.gid}(${this.groupname}) groups=${this.gid}(${this.groupname})`;
    }

    clear(): string {
        return "\n".repeat(255);
    }

    neofetch(): string {
    return `
██╗  ██╗███╗   ██╗ ██╗ ██████╗ ██╗  ██╗████████╗███████╗   
██║ ██╔╝████╗  ██║███║██╔════╝ ██║  ██║╚══██╔══╝██╔════╝   
█████╔╝ ██╔██╗ ██║╚██║██║  ███╗███████║   ██║   ███████╗   
██╔═██╗ ██║╚██╗██║ ██║██║   ██║██╔══██║   ██║   ╚════██║   
██║  ██╗██║ ╚████║ ██║╚██████╔╝██║  ██║   ██║   ███████║██╗
╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝

guest@kn1ghts
--------------
OS: Kn1ghtsOS
Host: 81D2 (Lenovo ideapad 330-15ARR)
Kernel: Linux 6.17.9-kn1ghts1-1
Uptime: 13 hours 37 mins
Packages: 1337
Shell: bash
DE: React
WM: TailwindWM
Terminal: kn1ghts-term
CPU: Brain™ x86_64
GPU: RTX 4060 (Laptop)
Memory: 578MB / 16GB
`.trim();
    }
}


export default Shell;

// function main() {
//     let bash = new Shell();
//     // console.log(bash.help());
//     // console.log(bash.ls(["l", "a"]));
//     // console.log(bash.cat(["about.txt", "M43s7r0.txt", "aboba"]))
//     // console.log(bash.echo("aboba"))
//     // console.log(bash.whoami());
//     // console.log(bash.id());
    
// }

// main();