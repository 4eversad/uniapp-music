<template>
	<view v-if="!loading">
		<view class="fixbg" :style="{backgroundImage: `url(${playList.coverImgUrl})`}">
			
		</view>
		<music-head title="歌单" :icon="true" color="white"></music-head>
		<view class="container">
			<scroll-view scroll-y="true" >
				<view class="list-head">
					<!-- 左侧区域 -->
					<view class="list-head-img">
						<image :src="playList.coverImgUrl" mode=""></image>
						<text class="iconfont icon-yousanjiao">{{playList.playCount | formatCount}}</text>
					</view>
					<!-- 右侧区域 -->
					<view class="list-head-text" >
						<!-- 标题 -->
						<view class="list-title">{{playList.name}}</view>
						<!-- 列表信息 -->
						<view class="list-info">
							<image :src="playList.creator.avatarUrl" mode="">
							</image>
								{{playList.creator.nickname}}
						</view>
						<!-- 列表描述信息 -->
						<view class="list-description">
							{{playList.description}}
						</view>
					</view>
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<button class="list-share" open-type="share">
					<text class="iconfont icon-fenxiang" ></text>
					分享给微信好友
				</button>
				<!-- #endif -->
				<view class="list-music">
					<!-- 顶部的区域 -->
					<view class="list-music-head">
						<text class="iconfont icon-bofang"></text>
						<text class="playAll">播放全部</text>
						<text class="totalSongs">(共{{playList.trackCount}}首)</text>
					</view>
					
					<!-- 列表里的所有歌曲 -->
					<view class="music-list-item" v-for="(item, index) in playList.tracks" @tap="handleToDetail(item.id)">
						<view class="list-song-top">{{index + 1}}</view>
						<!-- 歌曲描述的上部分 -->
						<view class="list-music-song">
							<view class="song-name">
								{{item.name}}
							</view>
							<!-- 歌曲的标记 -->
							<view class="song-sign">
								<image v-if="privileges[index].flag > 60 && privileges[index].flag < 70" src="../../static/dujia.png" mode=""></image>
								<image v-if="privileges[index].maxbr === 999000" src="../../static/sq.png" mode=""></image> 
								<!-- 歌手及专辑 -->
								{{item.ar[0].name}}-{{item.al.name}}
							</view>
						</view>
						<text class="iconfont play icon-24gl-playCircle"></text>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import musicHead from '../../components/musichead/musichead.vue'
	import {getList} from '../../common/api.js'
	export default {
		data() {
			return {
				playList:[],
				privileges: [],
				loading: true
			}
		},
		
		components:  {
			musicHead
		},
		
		methods: {
			handleToDetail(songId) {
				console.log(2222);
				uni.navigateTo({
					url:'/pages/detail/detail?songId=' + songId
				})
			}
			
			
			
		},
		onLoad(options) {
			uni.showLoading({
				title:'加载中...',
				
			})
			getList(options.id).then((res) =>{
				if(res[1].data.code == '200') {
					console.log(123);
					this.playList = res[1].data.playlist;
					this.privileges = res[1].data.privileges 
					this.$store.commit('INIT_TOPLISTIDS', res[1].data.playlist.trackIds)
					this.loading = false
					uni.hideLoading()
				}
				// console.log(this.playList);
			})
		}
	}
</script>

<style lang="scss">
	
	
	.list-head{
		// 左侧
		display: flex;
		margin: 50rpx;
		.list-head-img {
			width: 264rpx;
			height: 264rpx;
			border-radius: 30rpx;
			overflow: hidden;
			position: relative;
			margin-right: 42rpx;
			image {
				width: 100%;
				height: 100%;
			}
			text{
				position: absolute;
				right: 8rpx;
				color: white;
				font-size: 26rpx;
				
			}
		}
		// 右侧
		.list-head-text {
			flex: 1;
			color: #f0f2f7;
			// 列表标题
			.list-title{
				color: #fff;
				font-size: 34rpx
			}
			// 列表的信息
			.list-info {
				display: flex;
				margin: 20rpx 0;
				font-size: 24rpx;
				align-items: center;
				image {
					width: 54rpx;
					height: 54rpx;
					border-radius: 50%;
					margin-right: 14rpx;
				}
			}
			// 列表描述
			.list-description {
				line-height: 34rpx;
				font-size: 22rpx;
	
			}
		}
	}
	.list-share {
		color: #fff;
		text-align: center;
		font-size: 28rpx;
		width: 330rpx;
		height: 74rpx;
		line-height: 74rpx;
		border-radius: 37rpx;
		margin: 0 auto;
		background-color: rgba(0, 0, 0, .4);
		text {
			color: #fff;
			margin-right: 16rpx;
		}
		
	}

	.list-music {
		background-color: #fff;
		border-radius: 50rpx 50rpx 0 0 ;
		margin-top: 40rpx;
		overflow: hidden;
		// 顶部的播放全部区域
		// 头部
		.list-music-head {
			display: flex;
			line-height: 50rpx;
			height: 50rpx;
			margin: 30rpx 0 70rpx 22rpx;
			text:nth-child(1) {
				font-size: 50rpx;
			}
			.playAll{
				font-size: 30rpx;
				margin: 0 10rpx 0 26rpx;
				}
			.totalSongs{
				font-size: 26rpx;
				color: #b2b2b2;
			}
		}
		// 全部歌曲区域
		.music-list-item {
			display: flex;
			margin: 0 32rpx 66rpx 46rpx;
			align-items: center;
			color: #959595;
			.list-song-top {
				width: 58rpx;
				font-size: 30rpx;
				line-height: 30rpx;
			}
			.list-music-song {
				view:nth-child(2) {
					font-size: 20rpx;
					align-items: center;
				}
				flex: 1;
					// 歌曲名称
					.song-name {
						font-size: 28rpx;
						color: #000;
						width: 70vw;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
						
					}
					.song-sign {
						image {
							width: 32rpx;
							height: 20rpx;
							margin-right: 10rpx;
						}
						width: 70vw;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
					
						.singer {
							
						}
					}
					
				}
			
			.play {
				font-size: 50rpx;
				color: #c7c7c7;
			}
			
		}
		
		
	}
	

</style>
