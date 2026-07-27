import java.util.PriorityQueue;

class MedianFinder {
    priorityQueue<Integer> left;
    priorityQueue<Integer> right;
    public MedianFinder() {
        left = new PriorityQueue((a, b) -> b - a);
        right = new PriorityQueue();
    }
    
    public void addNum(int num) {
        if (left.size() == right.size()) {
            right.offer(num);
            left.offer(right.poll());
        } else {
            left.offer(num);
            right.offer(left.poll());
        }
    }
    
    public double findMedian() {
        if (left.size() > right.size()) {
            return left.poll();
        } else {
            return (left.poll() + right.poll()) / 2;
        }
    }
}

/**
 * Your MedianFinder object will be instantiated and called as such:
 * MedianFinder obj = new MedianFinder();
 * obj.addNum(num);
 * double param_2 = obj.findMedian();
 */