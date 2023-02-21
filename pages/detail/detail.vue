<template>
	<view class="detail" >
		<view class="fixbg" :style="{'background-image' : `url(${songDetail.al.picUrl})`}">
		</view>
	<music-head :title="songDetail.name" :icon="true" color="#fff"></music-head>
		<view class="container" v-if="!isLoading">
			<scroll-view scroll-y="true" >
				<view class="detail-play">
					<image :class="{'detail-play-run': isPlayRotates}" type="image":src="songDetail.al.picUrl" alt="">
					<text class="iconfont" :class="iconPlay" @tap="handleToPlay"></text>
					<view class=""></view>
				</view>
				<view class="detail-lyric">
					<view class="detail-lyric-wrap" :style="{transform: 'translateY('+ -(lyricIndex-1)*82 + 'rpx)'}"> 
						<view class="detail-lyric-item" v-for="(item,index) in songLyric" :key="index" :class="{active: lyricIndex == index}">{{item.lyric}}</view>
						
					</view>
				</view>
				<view class="detail-like">
					<view class="detail-like-head">
							喜欢这首歌的人也喜欢
					</view>
					<view class="detail-like-item" v-for="(item,index) in songSimi" @tap="handleToSimi(item.id)">
						<view class="detail-like-img">
							<!-- 歌曲的图片 -->
							<image :src="item.album.picUrl" mode=""></image>
						</view>
						<view class="detail-like-song">
							<view class="songName">
								{{item.name}}
							</view>
							<view class="songInfo">
								<image src="../../static/dujia.png" mode=""></image>
								<image v-if="item.privilege.maxbr === 999000" src="../../static/sq.png" mode=""></image>
								<text class="" v-for="(artist, i) in item.artists">
									<text v-if="i == item.artists.length - 1">{{artist.name}}</text>
									<text v-else>{{artist.name}}/</text>
								</text>
							</view>
						</view>
						<text class="iconfont icon-24gl-playCircle"></text>
					</view>
				</view>
				
				<!-- 评论区 -->
				<view class="detail-comment">
					<!-- 评论区域的顶部 -->
					<view class="detail-comment-head">
						精彩评论
					</view>
					<!-- 单个评论区域 -->
					<view class="detail-comment-item" v-for="(item, index) in songComment">
						<!-- 用户头像 -->
						<view class="detail-comment-img">
							<image :src="item.user.avatarUrl" mode=""></image>
						</view>
						<!-- 评论内容 -->
						<view class="detail-comment-content">
							<!-- 评论标题 -->
							<view class="detail-comment-title">
								<!-- 用户名和评论日期 -->
								<view class="detail-comment-name">
									<view class="user-name">{{item.user.nickname}}</view>
									<view class="comment-date">{{item.time | timeFormat}}</view>
								</view>
								<!-- 点赞数 -->
								<view class="detail-comment-like">{{item.likedCount}}
								<text class="iconfont icon-dianzan"></text></view>
							</view>
							<!-- 评论内容 -->
							<view class="detail-comment-text">
								{{item.content}}
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import musicHead from '../../components/musichead/musichead.vue'
	import {songDetail, songSimi, songComment, songLyric, songUrl} from '../../common/api.js'
	export default {
		components:{
			musicHead
		},
		data() {
			return {
				songDetail:{
					al: {
						picUrl: ''
					},
					
				},
				songSimi: [],
				songComment: [],
				songLyric:[],
				lyricIndex: 0,
				iconPlay: 'icon-zanting',
				isPlayRotates: true,
				bgAudioManager: '',
				isLoading: true,
				
			}
		},
		onLoad(options) {
			this.getMusic(options.songId)
		},
		onUnload() {
			console.log('onUnload');
			this.cancelInterval()
			// #ifdef H5
			this.bgAudioManager.destroy()
			// #endif
		},
		onHide() {
			// #ifdef H5
			
			this.bgAudioManager.destroy()
			// #endif
			console.log('onHide');
			this.cancelInterval()
		},
		methods: {
			// 获取歌曲的信息,相似歌曲, 歌曲评论, 歌词
			getMusic(songId) {
				this.$store.commit('NEXT_ID', songId)
				uni.showLoading({
					title:'加载中'
				})
				this.isLoading = true
				Promise.all([songDetail(songId), songSimi(songId), songComment(songId), songLyric(songId), songUrl(songId)]).then(res => {
					console.log(res);
					if(res[0][1].data.code == '200') {
						this.songDetail = res[0][1].data.songs[0]
					}
					if(res[1][1].data.code == '200') {
						this.songSimi = res[1][1].data.songs
					}
					if(res[2][1].data.code == '200') {
						this.songComment = res[2][1].data.hotComments
					}
					if(res[3][1].data.code == '200') {
						let lyric = res[3][1].data.lrc.lyric;
						// console.log(lyric);
						let re = /\[([^\]]+)\]([^\[]+)/g;
						let result = [];
						lyric.replace(re, ($0, $1, $2)  =>{
							result.push({"time": this.formatTimeToSecond($1), "lyric": $2})
						})
						this.songLyric = result;
						// console.log(this.songLyric);
					}
					if(res[4][1].data.code == '200') {
						// #ifdef MP-WEIXIN
						this.bgAudioManager = uni.getBackgroundAudioManager();
						this.bgAudioManager.title = this.songDetail.name;
						// #endif
						// #ifdef H5
						if(!this.bgAudioManager) {
						this.bgAudioManager = uni.createInnerAudioContext()
						console.log(this.bgAudioManager);
							
						}
						this.iconPlay = "icon-24gl-playCircle";
						this.isPlayRotates = false
						
						// #endif
						
						if(res[4][1].data.data[0].url) {
							this.bgAudioManager.src = res[4][1].data.data[0].url 
						}
						else {return uni.showModal({
							content:'该歌曲请前往云音乐APP播放',
							showCancel: false
							})}
							this.listenLyricIndex()
						this.bgAudioManager.onPlay(() => {
							this.iconPlay = "icon-zanting";
							this.isPlayRotates = true
							this.listenLyricIndex()
						})
						this.bgAudioManager.onPause(() => {
							console.log();
							this.iconPlay = "icon-24gl-playCircle";
							this.isPlayRotates = false
						})
						this.bgAudioManager.onEnded(() => {
							this.getMusic(this.$store.state.nextId)
						}) 
						
						}
						this.isLoading = false;
						uni.hideLoading()
					}) 
			},
			// 格式化歌词秒数
			formatTimeToSecond(value) {
				let arr = value.split(':')
				return (Number(arr[0] * 60) + Number(arr[1])).toFixed(1)
			},
			// 播放
			handleToPlay() {
				if(this.bgAudioManager.paused) {
					this.bgAudioManager.play()
				}
				else {
					this.bgAudioManager.pause()
					this.cancelInterval()
				}
			},
			// 监听歌词所在索引
			listenLyricIndex() {
				clearInterval(this.timer)
				this.timer = setInterval(() => {
					for(let i = 0; i < this.songLyric.length; i++) {
						if(this.bgAudioManager.currentTime > this.songLyric[this.songLyric.length -1].time) {
							this.lyricIndex = songLyric.length - 1;
							break
						}
						if(this.bgAudioManager.currentTime > this.songLyric[i].time &&
						 this.bgAudioManager.currentTime < this.songLyric[i+1].time) {
							this.lyricIndex = i
						}
					}
					}, 500
				)
			},
			// 销毁定时器
			cancelInterval() {
				clearInterval(this.timer)
			},
			// 点击了相似歌曲,进行数据更新
			handleToSimi(songId) {
				this.getMusic(songId)
			}
			
		}
	}
</script>

<style lang="scss" >
	@keyframes move {
		from {
			transform: rotate(0deg);
		} to {
			transform: rotate(360deg);
		}
	}
	.detail {
		// background-image: url('../../static/wangyiyunyinyue.png');
		.detail-play {
			width: 580rpx;
			height: 580rpx;
			background-image: url('@/static/disc.png');
			background-size: cover;
			margin:214rpx auto 0 auto;
			position: relative;
			image {
				width: 370rpx;
				height: 370rpx;
				border-radius: 50%;
				position: absolute;
				left: 0;
				right: 0;
				bottom: 0;
				top: 0;
				margin: auto;
				animation: 10s linear move infinite;
				animation-play-state: paused;
			}
			.detail-play-run {
				animation-play-state: running;
			}
			text {
				width: 100rpx;
				height: 100rpx;
				font-size: 100rpx;
				color: white;
				position: absolute;
				left: 0;
				right: 0;
				bottom: 0;
				top: 0;
				margin: auto;
				
			}
			view {
				width: 230rpx;
				height: 360rpx;
				background-image: url('@/static/needle.png');
				position: absolute;
				left: 80rpx;
				right: 0;
				top: -200rpx;
				margin: auto;
				background-size: cover;
				
			}
		}
	}
	
	.detail-lyric {
		font-size: 32rpx;
		line-height: 82rpx;
		height: 246rpx;
		text-align: center;
		overflow:hidden;
		color: #b6b6b6;
		.detail-lyric-wrap {
			transition: .5s;
			.detail-lyric-item {
				height: 82rpx;
				&.active {
					color: white;
				}
			}
			
		}
	}
	.detail-like {
		margin: 0 30rpx;
		// 喜欢-头部
		.detail-like-head {
			font-size: 36rpx;
			color: white;
			margin: 50rpx 0;
			
		}
		// 每项歌曲
		.detail-like-item {
			display: flex;
			align-items: center;
			margin-bottom: 28rpx;
			// 歌曲图片
			.detail-like-img {
				width: 82rpx;
				height: 82rpx;
				border-radius: 20rpx;
				overflow: hidden;
				margin-right: 20rpx;
				image {
					width: 100%;
					height: 100%;
				}
			}
				// 歌曲信息等
			.detail-like-song {
				flex: 1;
				color: #c6c2bf;
				.songName {
					font-size: 28rpx;
					color: white;
					margin-bottom: 12rpx;
					max-width: 400rpx;
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
				}
				.songInfo {
					image {
						width: 26rpx;
						height: 20rpx;
						margin-right: 10rpx;
					}
					text {
						font-size: 22rpx;
						
					}
				}
			}
			text {
				font-size: 50rpx;
				color: #c6c2bf;
			}
		}
	}
	.detail-comment {
		margin: 0 30rpx;

		// ]评论区标题
		.detail-comment-head {
			font-size: 35rpx;
			color: #fff;
			margin: 50rpx 0;
		}
		.detail-comment-item {
			margin-bottom: 28rpx;
			display: flex;
			// 头像
			.detail-comment-img {
				width: 64rpx;
				height: 64rpx;
				border-radius: 50%;
				overflow: hidden;
				margin-right: 18rpx;
				image {
					width: 100%;	
					height: 100%;
					// position: absolute;
					
				}
			}
			// 内容
			.detail-comment-content {
				flex: 1;
				color: #e8e7ec;
				.detail-comment-title {
					display: flex;
					justify-content: space-between;
					// 评论用户名/评论日期
					.detail-comment-name {
						.user-name {
							font-size: 26rpx;
						}
						.comment-date {
							font-size: 20rpx;
						}
					}
					// 点赞
					.detail-comment-like {
						font-size: 28rpx;
					}
				}
					.detail-comment-text {
						font-size: 28rpx;
						line-height: 40rpx;
						color: #fff;
						margin-top: 20rpx;
						border-bottom: 1px solid #e0e0e0;
						padding-bottom: 20rpx
					}
				
			}
		}
	}
	

</style>
