import {baseUrl} from './config.js'

// 获取歌单列表
export function topList() {
	let listIds = ['3', '0', '2', '1']
	return new Promise((resolve, reject)=> {
		uni.request({
			url:`${baseUrl}/toplist/detail`,
			success: res => {
				let result = res.data.list;
				result.length = 4;
				for(let i= 0;i<listIds.length; i++) {
					result[i].listId = listIds[i]
				}
				resolve(result)
				
			}
		})
		
	}) 
}

// 获取歌单信息
export function getList(id) {
	return uni.request({
		url: `${baseUrl}/playlist/detail?id=${id}`,
		method: 'GET'
		
	});
}

// 歌曲详情
export function songDetail(songId) {
	return uni.request({
		url:`${baseUrl}/song/detail?ids=${songId}`,
		method:'GET'
	})
}

// 相似歌曲
export function songSimi(songId) {
	return uni.request({
		url:`${baseUrl}/simi/song?id=${songId}`,
		method:'GET'
	})
}

// 歌曲评论
export function songComment(songId) {
	return uni.request({
		url:`${baseUrl}/comment/music?id=${songId}`,
		method:'GET'
	})
}

// 歌曲歌词
export function songLyric(songId) {
	return uni.request({
		url:`${baseUrl}/lyric?id=${songId}`,
		method:'GET'
	})
}

// 歌曲url
export function songUrl(songId) {
	return uni.request({
		url:`${baseUrl}/song/url?id=${songId}`,
		method:'GET'
	})
}
export function searchHot() {
	return uni.request({
		url:`${baseUrl}/search/hot/detail`,
		method:'GET'
	})
}
export function searchWord(word) {
	return uni.request({
		url:`${baseUrl}/search?keywords=${word}`,
		method:'GET'
	})
}
export function searchSuggest(word) {
	return uni.request({
		url:`${baseUrl}/search/suggest?keywords=${word}&type=mobile`,
		method:'GET'
	})
}
