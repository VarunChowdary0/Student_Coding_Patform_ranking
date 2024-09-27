# class Solution:
#     def singleNumber(self, nums):
#         dct = dict()
#         for i in nums:
#             if i in dct.keys():
#                 dct[i] += 1
#             else:
#                 dct[i] = 1
#         for i in dct:
#             if(dct[i]==1):
#                 print("Ans : ",i)
#                 break


# S = Solution()

# S.singleNumber([2,2,3,2])




# lst = [2,3,4,3,4,2,1,5,6,5,6]

# s = 0

# for i in lst:
#     s = s^i

# print(s)


# n = 32

# if(n&(n-1)==0):
#     print(n,"is power of 2")
# else:
#     print(n,"is Not power of 2")


class Solution:
    def largestInteger(self, num: int) -> int:
        str_num = str(num)
        len_f = len(str_num)//2
        tempp = []
        for i in str_num:
            tempp.append(i)
        print(tempp)
        e = []
        o = []
        for i in tempp:
            if(int(i)%2==0):
                e.append(i)
            else:
                o.append(i)
        for i in range(len(tempp)):
            print(tempp[i])
            if tempp[i] in e:
                print(e)
                mx = max(e)
                e.remove(mx)
                idx = tempp.index(mx)
                tempp[i],tempp[idx] = tempp[idx],tempp[i]
            if tempp[i] in o:
                print(o)
                mx = max(o)
                o.remove(mx)
                idx = tempp.index(mx)
                tempp[i],tempp[idx] = tempp[idx],tempp[i]
            
        print(tempp)
        # print(int("".join(tempp)))
        return int("".join(tempp))


s = Solution()
s.largestInteger(1234)
s.largestInteger(65875)