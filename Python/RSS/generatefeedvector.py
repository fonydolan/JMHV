# -*- coding: UTF-8 -*-

import feedparser
import re
import codecs

def getwordscounts(url):
    d=feedparser.parse(url)
    wc={}

    for e in d.entries:
        if 'summary' in e:
            summary=e.summary
        else:
            summary=e.description

        words =getwords(e.title+' '+summary)
        for word in words:
            wc.setdefault(word,0)
            wc[word]+=1
        return d.feed.title,wc

def getwords(html):
    txt=re.compile(r'<[^>]+>').sub('',html)

    words=re.compile(r'[A-Z^a-z]+').split(txt)

    return [word.lower() for word in words if word!='']


apcount={}
wordcounts={}
wordlist=[]

feedfile = codecs.open('feedlist.txt','r','utf-8')
feedlist=[line for line in feedfile]
feedfile.close()
for feedurl in feedlist:
    title,wc=getwordscounts(feedurl)
    wordcounts[title]=wc
    for word,count in wc.items():
        apcount.setdefault(word,0)
            if count > 1:
                apcount[word]+=1

for w,bc in apcount.items():
	frac=float(bc)/len(feedlist)
	if frac>0.1 and frac <0.5:
		wordlist.append(w)


out= codecs.open('blogdata.txt', 'a+', 'utf-8')    # file('blogdata.txt','w')
out.write('Blog')
for word in wordlist:
	out.write('\t%s' % word)
out.write('\n')
for blog,wc in wordcounts.items():
    out.write(blog)
    for word in wordlist:
        if word in wc:
	    out.write('\t%d' % wc[word])
	else:
            out.write('\t0')
        out.write('\n')
    out.write('\n')
out.write('\n')
out.close() 


#20170515
#《集体智慧编程》第三章 page 54
#

# ERROR1
#   unicodeencodeerror ascii 
# solution1:
#   import sys  reload(sys) sys.setdefaultencoding('utf-8')
# solution2:
#   import codecs   codecs.open('blogdata.txt', 'a+', 'utf-8') 

# codecs.open
#|模式|描述| 
#|:-:|:-:| 
#|r|仅读，待打开的文件必须存在| 
#|w|仅写，若文件已存在，内容将先被清空| 
#|a|仅写，若文件已存在，内容不会清空| 
#|r+|读写，待打开的文件必须存在| 
#|w+|读写，若文件已存在，内容将先被清空| 
#|a+|读写，若文件已存在，内容不会清空| 
#|rb|仅读，二进制，待打开的文件必须存在| 
#|wb|仅写，二进制，若文件已存在，内容将先被清空| 
#|ab|仅写，二进制，若文件已存在，内容不会清空| 
#|r+b|读写，二进制，待打开的文件必须存在| 
#|w+b|读写，二进制，若文件已存在，内容将先被清空| 
#|a+b|读写，二进制，若文件已存在，内容不会清空|







