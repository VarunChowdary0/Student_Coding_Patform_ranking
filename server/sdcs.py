class Solution:
    def singleNumber(self, nums):
        dct = dict()
        for i in nums:
            if i in dct.keys():
                dct[i] += 1
            else:
                dct[i] = 1
        for i in dct:
            if(dct[i]==1):
                print("Ans : ",i)
                break


S = Solution()

S.singleNumber([2,2,3,2])