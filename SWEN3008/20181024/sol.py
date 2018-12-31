import os

def read(filename):
    obj = open(filename, "r");
    contents = obj.read();
    obj.close();
    return contents
  
inputFilePath = "./test.txt"

txt = os.system("cat "+inputFilePath)

#SOLUTION 1 - REMOVE ALL VOWELS
txt2 = os.system("sed 's/[aeiouAEIOU]//g' "+inputFilePath)

#SOLUTION 2 - REMOVE ALL COMMENTS
txt3 = os.system("grep -o '^[^#]*' "+inputFilePath)

#SOLUTION 3 - THE NUMBER OF EFFECTIVE CODE LINES
txt4 = int(os.popen("wc -l "+inputFilePath).read().split(" ")[0]) - int(os.popen("grep -o '^[^#]*' "+inputFilePath+" | sed '/^\s*$/d' | wc -l").read().split(" ")[0])

#SOLUTION 4 - REMOVE DUPLIATE WORDS
txt5 = os.system("cat '"+inputFilePath+"' | sed 's_  *_ _g'")

#SOLUTION 5 - NUMBER OF PARAGRAPHS

