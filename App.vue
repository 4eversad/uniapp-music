<script>
	export default {
		onLaunch: function() {
		},
		onShow: function() {
		},
		onHide: function() {
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import url('./common/iconfont.css');
	.fixbg {
		width: 100%;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		background-size: cover;
		background-position: center 0;
		filter: blur(20px);
		transform: scale(1.2);
	}
	// 给容器高度,scroll-view才能正常使用,不将头部的navigation滚走
	.container {
		width: 100%;
		height: calc(100vh -70px);
		overflow: hidden;
		scroll-view {
			height: 100vh;
			width: 100%;
			// background-color: khaki;
		}
	}
</style>
