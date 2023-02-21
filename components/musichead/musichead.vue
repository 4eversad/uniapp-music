<template>
	<view class="music-head" :style="{color: color}">
		<view class="music-head-icon" v-if="icon" :class="{'music-head-iconblack': iconblack}">
			<text class="iconfont icon-zuojiantou" @tap="handleToBack"></text>|
			<text class="iconfont icon-shouye" @tap="handleToHome" ></text>
		</view>
		{{title}} 
		
	</view>
</template>

<script>
	import '../../common/iconfont.css'
	export default {
		name:"musichead",
		data() {
			return {
				
				
			};
			
		},
		props: ['title', 'icon', 'color', "iconblack"],
		methods: {
			handleToBack() {
				uni.navigateBack()
			},
			handleToHome() {
				uni.navigateTo({
					url:'/pages/index/index'
				})
			}
		}
	}
</script>

<style lang="scss" >
	.music-head {
		position: relative;
		// z-index: 999;
		height: 75px; 
		width: 100%; 
		font-size: 16px;
		line-height: 80px;
		text-align: center;
		// color: pink;
		.music-head-icon {
			position: absolute; 
			left: 8px;
			top: 24px;
			width: 90px;
			height: 30px;
			background-color: rgba(0, 0, 0, .4);
			color: white;	
			line-height: 30px;
			border-radius: 15px;
			display: flex;
			justify-content: space-evenly;
		}
		.music-head-iconblack {
			color: black;
			border: 1px #eaeaea solid;
			background: #fff;
		}
	}

</style>