<script>
import { STATUS, FILES_RETRIEVAL_MODE } from '@/Enums.js'
export default {
	data() {
		return {
			/*** ENUMS ****/
			STATUS: STATUS,
			FILES_RETRIEVAL_MODE: FILES_RETRIEVAL_MODE,

			/*** Local State *****/
			syncedSeconds: 0,
			timerInterval: null,
			shownMenu: null,

			/**** CONSTANTS *****/
			ICONS: {
				default: 'default.svg',
				'application/pdf': 'pdf.svg',
				'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'office.svg',
				'image/jpeg': 'image.svg',
				'image/gif': 'image.svg',
				'image/svg+xml': 'image.svg',
				'image/png': 'image.svg'
			}
		}
	},
	props: {
		files: Object,
		loadStatus: String,
		lastSyncedDate: Date,
		viewAllUploads: Boolean,
		remove: Boolean,
		update: Boolean,
		filesRetrievalMode: String,
		translate: Function
	},
	watch: {
		lastSyncedDate() {
			this.runSyncTimer()
		}
	},
	computed: {
		getFileslabel() {
			console.log(this.filesRetrievalMode)
			if (this.filesRetrievalMode == FILES_RETRIEVAL_MODE.RECENT) {
				return this.translate('View all uploads')
			} else {
				return this.translate('View recent')
			}
		},
		lastSynced() {
			if (this.syncedSeconds >= 60) {
				// minutes
				let minutes = Math.floor(this.syncedSeconds / 60)
				if (minutes == 1) {
					return minutes + ' ' + this.translate('minute')
				}
				return minutes + ' ' + this.translate('minutes')
			} else {
				// seconds
				if (this.syncedSeconds == 1) {
					return this.syncedSeconds + ' ' + this.translate('second')
				}
				return this.syncedSeconds + ' ' + this.translate('seconds')
			}
		}
	},
	methods: {
		toggleGetFiles() {
			console.log('toggled')
			let newMode = ''
			if (this.filesRetrievalMode == FILES_RETRIEVAL_MODE.RECENT) {
				newMode = FILES_RETRIEVAL_MODE.ALL
			} else {
				newMode = FILES_RETRIEVAL_MODE.RECENT
			}
			this.getFiles(newMode)
		},
		getFiles(mode) {
			if (!mode) {
				mode = this.filesRetrievalMode
			}
			this.$emit('getFiles', mode)
		},
		removeFile(id) {
			this.hideMenu()
			this.$emit('removeFile', id)
		},
		updateFile(id) {
			this.hideMenu()
			this.$emit('updateFile', id)
		},
		fillIcon(file) {
			let iconFilename = ''
			if (!file) {
				file.file_type = 'default'
			}
			iconFilename = this.ICONS[file.file_type]
			return '/icons/' + iconFilename
		},
		fillFilename(file) {
			let filename = this.sanitizeFilename(file.original_file_name)
			return filename
		},
		fillFileSizeOrStatus(file) {
			if (!file.file_size) {
				return 'error'
			}
			let filesize = Math.ceil(file.file_size / 1000)
			return filesize + 'KB'
		},
		fillLastUpdated(file) {
			let lastUpdatedMsg = ''
			let now = new Date()
			let created = file.datetime_created ? new Date(file.datetime_created) : null //'2024-01-22T07:20:18.000Z',
			let updated = file.datetime_updated ? new Date(file.datetime_updated) : null
			let lastDated = updated?.getTime() > created?.getTime() ? updated : created
			let timeDifference = 0
			if (lastDated) {
				timeDifference = now.getTime() - lastDated.getTime()
			}
			// Return Seconds
			if (timeDifference / 1000 / 60 < 1) {
				lastUpdatedMsg = `${Math.floor(timeDifference / 1000)}s ${this.translate('ago')}`
			}
			// Return Minutes
			if (timeDifference / 1000 / 60 >= 1) {
				lastUpdatedMsg = `${Math.floor(timeDifference / 1000 / 60)}m ${this.translate('ago')}`
			}
			// Return Hours
			if (timeDifference / 1000 / 60 >= 60) {
				lastUpdatedMsg = `${Math.floor(timeDifference / 1000 / 60 / 60)} ${this.translate('hours')} ${this.translate('ago')}`
			}
			// Return Days
			if (timeDifference / 1000 / 60 / 60 >= 24) {
				lastUpdatedMsg = `${Math.floor(timeDifference / 1000 / 60 / 60 / 24)} ${this.translate('days')} ${this.translate('ago')}`
			}
			return lastUpdatedMsg
		},
		sanitizeFilename(filename) {
			return filename
		},
		runSyncTimer() {
			// Create timer that will run every 10 seconds to update the last Synced by seconds
			if (!this.lastSyncedDate) {
				return
			}
			clearInterval(this.timerInterval)
			let calculateSeconds = () => {
				this.syncedSeconds =
					Math.floor(new Date().getTime() / 1000) - Math.floor(this.lastSyncedDate.getTime() / 1000)
			}
			calculateSeconds()
			this.timerInterval = setInterval(() => {
				calculateSeconds()
			}, 1000 * 10)
		},
		showMenu(id) {
			console.log(id)
			this.shownMenu = id
		},
		hideMenu() {
			this.shownMenu = null
		}
	},
	mounted() {
		this.runSyncTimer()
		document.addEventListener('click', (event) => {
			this.hideMenu(event)
		})
	}
}
</script>

<template>
	<div class="list-container">
		<div class="body">
			<div class="files-container">
				<div v-if="loadStatus == STATUS.PENDING" class="loading">
					{{ this.translate('loading') }}...
				</div>
				<div class="file-container" v-for="file in files" :key="file.id">
					<div class="details">
						<span class="icon"><img :src="fillIcon(file)" /></span>
						<div class="user-journey">
							<div class="filename">{{ fillFilename(file) }}</div>
							<div class="last-updated">{{ fillLastUpdated(file) }}</div>
						</div>
					</div>
					<div class="tag">{{ fillFileSizeOrStatus(file) }}</div>
					<div class="menu" @click.stop="showMenu(file.id)">
						<img src="/icons/elipsis.svg" />
						<ul class="drop-menu" :class="[this.shownMenu == file.id ? '' : 'hide']">
							<li @click.stop="updateFile(file.id)" v-if="update === true">
								<img src="/icons/edit.png" /><span>{{ this.translate('Update File') }}</span>
							</li>
							<li @click.stop="removeFile(file.id)" v-if="remove === true">
								<img src="/icons/remove.png" /><span>{{ this.translate('Remove File') }}</span>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div v-if="viewAllUploads !== false" class="view-all-container">
				<button class="view-all-uploads" @click="toggleGetFiles">{{ getFileslabel }}</button>
			</div>
		</div>
	</div>
	<div class="footer" v-if="lastSyncedDate">
		<span><i></i> {{ this.translate('Last Synced: ') + lastSynced + ' ' + this.translate('ago') }}
			<span class="refreshed-notice">{{
				translate('(refreshed every 10 seconds / 1 minute)')
			}}</span></span>
	</div>
</template>

<style scoped>
.files-container {
	font-family: Inter;
	font-weight: 500;
	align-self: stretch;
	flex-grow: 0;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: stretch;
	gap: 12px;
	padding: 16px;
	position: relative;
	min-height: 200px;
}

[lang='ar_AE'] .files-container {
	font-family: 'Noto Kufi Arabic', sans-serif;
}

.file-container {
	height: 51px;
	align-self: stretch;
	flex-grow: 0;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	gap: 16px;
	padding: 0;
	border-bottom: 1px solid var(--primary-border);
}

.footer {}

.details {
	height: 34px;
	flex-grow: 1;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	gap: 16px;
	padding: 0;
	align-items: center;
}

.user-journey {
	position: relative;
	align-self: center;
	flex-grow: 0;
	font-size: 14px;
	font-stretch: normal;
	font-style: normal;
	line-height: 16px;
	letter-spacing: normal;
	text-align: left;
}

.tag {
	width: auto;
	height: 20px;
	flex-grow: 0;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	padding: 4px 8px;
	border-radius: 2px;
	border: solid 1px var(--button-border);
	font-size: 11px;
	font-weight: 600;
}

.icon {
	width: 16px;
	height: 16px;
	margin: 0 16px;
}

.last-updated {
	font-size: 0.8em;
	line-height: 14px;
}

[lang='ar_AE'] .last-updated {
	text-align: right;
}

.view-all-container {
	display: flex;
	justify-content: center;
	width: 100%;
	margin-bottom: 20px;
}

.view-all-uploads {
	padding: 7px 20px;
	color: var(--primary-text);
	border: 1px solid var(--button-border);
	border-radius: 40px;
}

.menu {
	padding: 6px;
	cursor: pointer;
}

.drop-menu {
	position: absolute;
	z-index: 8;
	right: 20px;
	background: white;
	padding: 10px 0;
	border: 1px solid #d4d4d4;
	border-radius: 8px;
	box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.1);
	font-size: 10px;
	list-style: none;
}

/** Arabic Style */
[lang='ar_AE'] .drop-menu {
	right: auto;
	left: 20px;
}

.drop-menu>li {
	padding: 2px 10px;
}

.drop-menu>li:hover {
	background: var(--background);
}

.drop-menu>li>* {
	vertical-align: middle;
}

.drop-menu>li>img {
	width: auto;
	height: 14px;
	margin: 5px;
}
</style>
