- 在图论中，Prim算法解决的问题是连通无向有权图中最小生成树问题，而Dijkstra算法解决的问题是源点到目标点的最短路径问题。
- 虽然这两个算法在添加新结点时，都是选择“距离最短”的结点加入集合，但是Prim算法中，“距离最短”是指未访问的结点<u>到已经访问的所有结点</u>距离最小，即将已经访问的结点视为一个整体，将距离最小的结点加入到已访问的集合中；而在Dijkstra算法中，“距离最短”是指所有未访问结点（通过已访问的结点）<u>到源点</u>距离最小。
- 在Prim算法中，数组元素`dis[i]`表示未访问结点i到已访问结点集合的最短距离，所以此时需要len记录最短距离。而Dijkstra算法中，数组元素`dis[i]`表示未访问结点i到源点的最短距离

更新距离数组`dis[]`，Prim算法：

```cpp
for(int v = 0; v < n; v++){
	//G[][]表示连通无向有权图，u表示新加入的结点。
	if(!vis[v] && G[u][v] < dis[v]){
		dis[v] = G[u][v];
	}
}
```

Dijkstra算法：

```cpp
for(int v = 0; v < n; v++){
	if(!vis[v] && G[u][v] + dis[u] < dis[v]){
		dis[v] = G[u][v] + dis[u];
	}
}
```

给出Prim算法以及Dijkstra算法的完整程序：

```cpp
void Prim(){
	fill(vis, 0, maxn);
	int len = 0;
	dis[0] = 0;
	for(int i = 1; i < n; i++){
		//初始化数组dis[]
	dis[i] = G[0][i];
	}
	for(int i = 0; i < n; i++){
		int u = -1, mind = inf;
		for(int j = 0; j < n; j++){
			if(!vis[j] && dis[j] < mind){
				u = j;
				mind = dis[j];
			}
		}
		if(u == -1) return;
		len += mind;
		vis[u] = 1;
		for(int v = 0; v < n; v++){
			if(!vis[v] && G[u][v] < dis[v])
				dis[v] = G[u][v];
		}
	}
}
```

```cpp
void Dijkstra(){
	fill(vis, 0, maxn);
	fill(dis, dis + maxn, inf);
	dis[0] = 0; //将0设置为源点，同理可设置目标点，只需添加一个if判断即可
	for(int i = 0; i < n; i++){
		int u = -1, mind = inf;
		for(int j = 0; j < n; j++){
			if(!vis[j] && dis[j] < mind){
				u = j;
				mind = dis[j];
			}
		}
		if(u == -1) return;
		vis[u] = 1;
		for(int v = 0; v < n; v++){
			if(!vis[v] && G[u][v] + dis[u] < dis[v])
				dis[v] = G[u][v] + dis[u];
		}
	}
}
```
