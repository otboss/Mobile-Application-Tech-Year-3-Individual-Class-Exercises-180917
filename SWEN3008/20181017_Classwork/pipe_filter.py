import os
import subprocess

def cmd(command):
    return str(subprocess.check_output(command, shell=True))#subprocess.Popen([command], stdout=subprocess.PIPE).stdout.read()

workingDirectory = (os.path.dirname(os.path.realpath(__file__)))

def read(filename):
    obj = open(filename, "r");
    contents = obj.read();
    obj.close();
    return contents

def filePicker():
    while True:
        try:
            fls = cmd("ls").split("\n")
            print("\nAvailable Files")
            for x in range(len(fls)-1):
                print(str(x)+"] "+fls[x])
            file = int(raw_input("Selection: "))
            return fls[file]
        except:
            print("\nPlease make a valid selection\n")

while True:
    try: 
        choice = int(raw_input(
"""
================================
            OPTIONS
================================
1] Check the length of a line
2] Check the word cound of a line
3] Squeeze repetition spaces
4] Calculate total size of files in a directory and sort them in a file
5] Calculate the size percentage of .java files in directory
6] Exit
================================
Selection: """))
        if choice < 1 or choice > 6:
            raise Exception()
        if choice == 1:
            file = filePicker()
            while True:
                try:
                    line = int(raw_input("\nSelect line: "))
                    print("\n\n")
                    print("========================")
                    print("Length of that line:  |"+str(int(subprocess.check_output("sed -n '"+str(line)+","+str(line)+"p' '"+workingDirectory+"/"+file+"' | wc -w", shell=True))))
                    print("========================")
                    print("Command Used : ")
                    print("sed -n '"+str(line)+","+str(line)+"p' '"+workingDirectory+"/"+file+"' | wc -c")
                    print("========================")
                    break
                except Exception as e:
                    print(e)
                    print("\nEnter valid input\n")
        if choice == 2:
            file = filePicker()
            while True:
                try:
                    line = int(raw_input("\nSelect line: "))
                    print("\n\n")
                    print("========================")
                    print("Words of that line: "+str(int(subprocess.check_output("sed -n '"+str(line)+","+str(line)+"p' '"+workingDirectory+"/"+file+"' | wc -w", shell=True))))
                    print("========================")
                    print("Command Used : ")
                    print("sed -n '"+str(line)+","+str(line)+"p' '"+workingDirectory+"/"+file+"' | wc -w")
                    print("========================")
                    break
                except Exception as e:
                    print(e)
                    print("\nEnter valid input\n") 
        if choice == 3:
            file = filePicker()
            while True:
                try:
                    print("\n\n")
                    print("========================")
                    print("Text Without Repeated Whitespaces: "+cmd("cat '"+workingDirectory+"/"+file+"' | sed 's_  *_ _g'"))
                    print("========================")
                    print("Command Used : ")
                    print("cat '"+workingDirectory+"/"+file+"' | sed 's_  *_ _g'")
                    print("========================")
                    break
                except Exception as e:
                    print(e)
                    print("\nEnter valid input\n") 

        if choice == 4:
            path = raw_input("""
OPTIONS:
1] Custom Path
2] Current Directory
Selection: """) 
            print("\n\n")               
            if(path == "1"):
                path = raw_input("Enter Desired Path: ")
                report = cmd("du -abc '"+path+"'")
                print(report)
                cmd("du -abc '"+path+"' > pathReport.txt")
                print("\n\nCommand Used : ")
                print("du -abc '"+path+"' > pathReport.txt")                
            else:
                report = cmd("du -abc '"+workingDirectory+"'")
                print(report)
                cmd("du -abc '"+workingDirectory+"' > pathReport.txt")
                print("\n\nCommand Used : ")
                print("du -abc '"+workingDirectory+"' > pathReport.txt")                    

        if choice == 5:
            path = raw_input("""
OPTIONS:
1] Custom Path
2] Current Directory
Selection: """) 
            print("\n\n")               
            if(path == "1"):
                path = raw_input("Enter Desired Path: ")
                report = cmd("du -cbh '"+path+"'*.java -abc")
                print(report)
                cmd("du -abc '"+path+"' > javaPathReport.txt")
                print("\n\nCommand Used : ")
                print("du -abc '"+path+"' > javaPathReport.txt")                   
            else:
                report = cmd("du -cbh '"+workingDirectory+"'*.java -abc")
                print(report)
                cmd("du -cbh '"+workingDirectory+"'*.java -abc > javaPathReport.txt")
                print("\n\nCommand Used : ")
                print("du -cbh '"+workingDirectory+"' > javaPathReport.txt")                    
        if choice == 6:
            break
    except:
        print("\nPlease make a valid selection\n")
    
    