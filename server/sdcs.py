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
