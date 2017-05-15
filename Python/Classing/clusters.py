# -*- coding: UTF-8 -*-

import codecs
from math import sqrt
from numpy import *

def readfile(filename):
    filen = codecs.open(filename,'r','utf-8')
    lines=[line for line in filen]
    filen.close()

    #第一行标题
    colnames=lines[0].strip().split('\t')[1:]
    rownames=[]
    data=[]
    for line in lines[1:]:
        #第一列列名
        p=line.strip().split('\t')
        rownames.append(p[0])
        data.append([float(x) for x in p[1:]])
    return rownames,colnames,data

#皮尔逊相关度 完全匹配值为1.0 毫无关系为0.0
def pearson(v1,v2):
    data = numpy.arange(v1,v2)
    if numpy.any(len(data)<=0) or len(v1) != len(v2):
        print v1,v2
        return 0
    #求和
    sum1=sum(v1)
    sum2=sum(v2)

    #求平方和
    sum1Sq=sum([pow(v,2) for v in v1])
    sum2Sq=sum([pow(v,2) for v in v2])

    #求乘积之和
    pSum=sum([v1[i]*v2[i] for i in range(len(v1))])

    print v1
    #计算r (Person score)
    num=pSum-(sum1*sum2/len(v1))
    den=sqrt((sum1Sq-pow(sum1,2)/len(v1))*(sum2Sq-pow(sum2,2)/len(v2)))
    if den==0:return 0
    return 1.0-num/den

def hcluster(rows,distance=pearson):
    distances={}
    currentclustid=-1

    #
    clust=[bicluster(rows[i],id=i) for i in range(len(rows))]
    while len(clust)>1:
        lowestpair=(0,1)
        closest=distance(clust[0].vec,clust[1].vec)
        #遍历每一个配对，寻找最小距离
        count=len(clust)
        for i in range(count):
            for j in range(i+1,count):
                #用distances来缓存距离的计算
                if(clust[i].id,clust[j].id) not in distances:
                    distances[(clust[i].id,clust[j].id)]=distance(clust[i].vec,clust[j].vec)

                d=distance[(clust[i].id,clust[j].id)]
                if d<closest:
                    closest=d
                    lowestpair=(i,j)
            #计算两个聚类的平均值
            mergevec=[
                (clust[lowestpair[0]].vec[i]+clust[lowestpair[1]].vec[i])/2.0
                for i in range(len(clust[0].vec))]

            #建立新聚类
            newcluster=bicluster(mergevec,left=clust[lowestpair[0]],
                                 right=clust[lowestpair[1]],
                                 distance=closest,id=currentclustid)
            #不在原始集合中的聚类，id为负数
            currentclustid-=1
            del clust[lowestpair[1]]
            del clust[lowestpair[0]]
            clust.append(newcluster)
    return clust[0]
            
        
    
    


class bicluster:
    def __init__(self,vec,left=None,right=None,distance=0.0,id=None):
        self.left=left
        self.right=right
        self.vec=vec
        self.id=id
        self.distance=distance


        
def Go():
    blognames,words,data=readfile('blogdata.txt')
    clust=hcluster(data)
    print clust











