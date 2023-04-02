package com.dirask.random;

import java.util.concurrent.ThreadLocalRandom;

/*

reference:
https://dirask.com/q/java-simple-random-util-generator-with-min-max-in-range-api-methods-8jmNA1

*/
public class RandomUtil {

    public static int nextInt() {
        return ThreadLocalRandom.current().nextInt();
    }

    public static long nextLong() {
        return ThreadLocalRandom.current().nextLong();
    }

    public static float nextFloat() {
        return ThreadLocalRandom.current().nextFloat();
    }

    public static double nextDouble() {
        return ThreadLocalRandom.current().nextDouble();
    }

    public static int nextIntBetween(int min, int max) {
        return ThreadLocalRandom.current().nextInt(min, max);
    }

    public static long nextLongBetween(long min, long max) {
        return ThreadLocalRandom.current().nextLong(min, max);
    }

    public static float nextFloatBetween(float min, float max) {
        return (ThreadLocalRandom.current().nextFloat() * (max - min)) + min;
    }

    public static double nextDoubleBetween(double min, double max) {
        return ThreadLocalRandom.current().nextDouble(min, max);
    }

    // usage example
    public static void main(String[] args) {
        System.out.println(RandomUtil.nextInt()); // 814082468
        System.out.println(RandomUtil.nextLong()); // 6168205606450145596
        System.out.println(RandomUtil.nextFloat()); // 0.9008545
        System.out.println(RandomUtil.nextDouble()); // 0.6147962628743574

        System.out.println(RandomUtil.nextIntBetween(2, 50)); // 31
        System.out.println(RandomUtil.nextLongBetween(2L, 500L)); // 348
        System.out.println(RandomUtil.nextFloatBetween(2.0f, 4.0f)); // 2.3247766
        System.out.println(RandomUtil.nextDoubleBetween(2.0d, 4.0d)); // 2.0241598371950804
    }
}
