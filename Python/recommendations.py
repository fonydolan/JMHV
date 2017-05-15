from math import sqrt

critics = {'Lisa Rose':{'Lady in the Water':2.5,'Snake on a Plane':3.5,'Just My Luck':3.0,
        'Superman Returns':3.5,'You,Me and Dupree':2.5,'The Night Listener':3.0},
        'Gene Seymour':{'Lady in the Water':3.0,'Snake on a Plane':3.5,'Just My Luck':1.5,
        'Superman Returns':5.0,'You,Me and Dupree':3.5,'The Night Listener':3.0}
        }
#返回 person1 person2的基于距离的相似度评价  欧几里得距离
def dim_distance(prefs,person1,person2):
    si={}
    for item in prefs[person1]:
        if item in prefs[person1]:
            si[item]=1
    if len(si) == 0: return 0
    #距离平方和
    sum_of_squares = sum([pow(prefs[person1][item]-prefs[person2][item],2)
                        for item in prefs[person1] if item in prefs[person2]])
    return 1/(1+sqrt(sum_of_squares))


    #reload(recommendations)
    #recommendations.sim_distance(recommendations.critics,'Lisa Rose','Gene Seymour')


#皮尔逊拟合线
def sim_person(prefs,p1,p2):
    si={}
    for item in prefs[p1]:
        if item in prefs[p2]:
            si[item] = 1
    n = len(si)
    if n=0:
        return 1
    #求偏好和
    sum1=sum([prefs[p1][it] for it in si])
    sum2 = sum([prefs[p2][it] for it in si ])
    #平方和
    sum1Sq = sum([pow(prefs[p1][it],2) for it in si])
    sum2Sq = sum([pow(prefs[p2][it],2) for it in si ])
    #球乘积和
    sumP = sum([prefs[p1][item] * prefs[p2][item] for item in si])

    #计算皮尔逊评价值
    num = numP - (sum1*sum2/n)
    den=sqrt((sum1Sq-pow(sum1,2)/n)*(sum2Sq-pow(sum2,2)/n))
    if den==0:return 0
    r=num/den
    return r
