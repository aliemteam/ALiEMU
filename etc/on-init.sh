#!/usr/bin/env bash

wp w3-total-cache option set --type=boolean common.track_usage false

wp w3-total-cache option set --type=boolean objectcache.enabled              true
wp w3-total-cache option set --type=boolean objectcache.enabled_for_wp_admin false
wp w3-total-cache option set --type=string  objectcache.engine               redis
wp w3-total-cache option set --type=array   objectcache.redis.servers        redis:6379
wp w3-total-cache option set --type=boolean objectcache.fallback_transients  false
wp w3-total-cache option set --type=integer objectcache.lifetime             999999
