<template>
	<view class="index">
		<!-- 顶部的navigationBar(自定义) -->
			<music-head title="网易云音乐" :icon="true" color="#000"></music-head>
		<!-- 下面滚动的区域 -->
		<view class="container">
			<scroll-view scroll-y="true" >
				<!-- 搜索区域 -->
				<view class="index-search" @tap="handleToSearch">
					<text class="iconfont icon-search"></text>
					<input type="text" placeholder="搜索歌曲"></input>
				</view>
				<view v-if="isLoading">
					<view class="skeleton" >
				        <m-for-skeleton
				        :avatarSize="200"
				        :row="3"
				        :loading="isLoading"
				        isarc="square"
				        v-for="(item,key) in 4"
				        :key="key"
						:titleStyle="{}"
						:title="false"
						>
				        </m-for-skeleton>
					</view>
				</view>
				
				<view v-else>
				<!-- 列表区域 -->
					<view class="index-list">
						<view class="index-list-item" v-for="(item, index) in topList" @tap="handleToList(item.id)">
							<view class="index-list-img">
								<image :src="item.coverImgUrl" mode=""></image>
								<text>{{item.updateFrequency}}</text>
							</view>
							<view class="index-list-text">
								<view 
								v-for="(subItem, index) in item.tracks"
								:key="index"
								>{{index+1}}.{{subItem.first}}-{{subItem.second}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import '../../common/iconfont.css'
	import musicHead from '../../components/musichead/musichead'
	import {topList} from '../../common/api.js'
	
	export default {
		components: {
			musicHead
		},
		data() {
			return {
				topList: [],
				isLoading: true
				
			}
		},
		onLoad() {
			topList().then(( res =>{
				if(res) {
					this.topList = res
					setTimeout(() => {
						this.isLoading = false
					}, 0)
				}
			}))

		}, 
		methods: {
			handleToList(id) {
				uni.navigateTo({
					url:'/pages/list/list?id='+ id 
				})
			},
			handleToSearch() {
				uni.navigateTo({
					url: '/pages/search/search'
				})
			}

		}
	}
</script>

<style lang="scss" scoped>
	.nav {
		position: sticky;
		top: 0;
		height: 30px;
	}
	.container {
		width: 100%;
		height: calc(100vh -70px);
		overflow: hidden;
		scroll-view {
			height: 100vh;
			width: 100%;
			// background-color: khaki;
		}
		.index-search {
			display: flex;
			height: 70rpx;
			margin: 70rpx 30rpx 30rpx 30rpx;
			align-items: center;
			background-color: #f7f7f7;
			border-radius: 50rpx;
			text {
				font-size: 26rpx;
				margin-right: 26rpx;
				margin-left: 28rpx;
				
			}
			input{
				font-size: 28rpx;
				flex: 1;
				
				
			}
		}
		
		.index-list {
			margin: 0px 30rpx;
			
			.index-list-item {
				display: flex;
				margin-bottom: 34rpx;
				
				.index-list-img {
					position: relative;
					border-radius: 30rpx;
					overflow: hidden;
					margin-right: 22rpx;
						width: 212rpx;
						height: 212rpx;
					image {
						width: 100%;
						height: 100%;
					}
					text {
						position: absolute;
						left: 12rpx;
						bottom: 16rpx;
						color: white;
						font-size: 20rpx;
						
					}
				}
				.index-list-text {
					max-width: 350rpx;
					line-height: 66rpx;
					font-size: 24rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					
				}
			}
		}
	}
	
	
</style>
