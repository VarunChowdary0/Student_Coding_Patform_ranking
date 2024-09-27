import java.util.Arrays;

public class Solution {
    public int largestInteger(int num) {
        int tmp = num;
        int n = 0;
        int e =0; 
        int o = 0; 
        while(tmp>0){
            tmp/=10;
            n++;
        }
        tmp = num;
        System.out.println(n);
        int[] ary = new int[n];
        int i = n-1;
        while(tmp>0){
            int r = tmp%10;
            tmp/=10;
            if(r%2==0){
                ary[i] = 0;
                e++;
            }
            else{
                o++;
                ary[i] = 1;
            }
            i--;
        }
        int[] eve = new int[e];
        int[] odd = new int[o];

        int e_ = 0;
        int o_ = 0;
        

        tmp = num;
        while(tmp>0){
            i = tmp%10;
            tmp/=10; 
            if(i%2==0){
                eve[e_] = i;
                e_++;
            }
            else{
                odd[o_] = i;
                o_++;
            }
        }

        
        Arrays.sort(eve);
        Arrays.sort(odd);

        System.out.println(Arrays.toString(eve));
        System.out.println(Arrays.toString(odd));
        
        return num;
    }
    public static void main(String[] args){
        Solution s = new Solution();
        System.out.println(s.largestInteger(1234));
        System.out.println("---------------------------");
        System.out.println(s.largestInteger(1031));
        System.out.println("---------------------------");
        System.out.println(s.largestInteger(57523));
    }
}