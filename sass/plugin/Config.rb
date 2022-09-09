Encoding.default_external = 'UTF-8'

require "sass"


$projectFileDir = File.expand_path('../../../', __FILE__)
$httpPath = "../"
$cssDir = "css"
$sassDir = "sass"
$imagesDir = "images"
$jsDir = "js"


#log
$logger = Sass::Logger::Base.new()
# $logger.log(:debug, "指定されたファイルが見つかりませんでした。()")
#$logger.log(:debug,'aaaaa')


#$logger.log(:debug, File.expand_path('../', __FILE__))

#読み込むrubyファイル
require (File.expand_path('../', __FILE__) + '/CustomFunction')
require (File.expand_path('../', __FILE__) + '/JSON2MapPlugin')
