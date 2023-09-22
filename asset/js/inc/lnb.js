document.write(
	`
	<div class="lnb">
    <div class="title_wrap">
        <h2>제목</h2>
    </div>
		<div class="accordion lnb-depth01 is-type-one">
			<ul>
				<li>
					<button type="button" class="accordion-name"><!-- 활성화 class [active] -->
						<span class="name">메뉴1</span>
						<i class="icon-menu rotate"></i>
					</button>
					<div class="accordion-content">
						<div class="accordion lnb-depth02 is-type-one">
							<ul>
								<li>
									<button type="button" class="accordion-name type-dot"><!-- 활성화 class [active] -->
										<span class="name">메뉴 1-1</span>
										<i class="icon-menu rotate"></i>
									</button>
									<div class="accordion-content">
										<ul class="lnb-depth03">
											<li><a href="#">메뉴 1-1-1</a></li><!-- 활성화 class [active] -->
											<li><a href="#">메뉴 1-1-2</a></li>
											<li><a href="#">메뉴 1-1-3</a></li>
											<li><a href="#">메뉴 1-1-4</a></li>
										</ul>
									</div>
								</li>
								<li>
									<button type="button" class="accordion-name type-dot">
										<span class="name">메뉴1-2</span>
										<i class="icon-menu rotate"></i>
									</button>
									<div class="accordion-content">
										<ul class="lnb-depth03">
											<li><a href="#">메뉴 1-1-1</a></li>
											<li><a href="#">메뉴 1-1-2</a></li>
										</ul>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</li>
				<li>
					<button type="button" class="accordion-name">
						<span class="name">메뉴2</span>
						<i class="icon-menu rotate"></i>
					</button>
					<div class="accordion-content">
						<div class="accordion lnb-depth02 is-type-one">
							<ul>
								<li>
									<button type="button" class="accordion-name type-dot">
										<span class="name">메뉴 1-1</span>
										<i class="icon-menu rotate"></i>
									</button>
									<div class="accordion-content">
										<ul class="lnb-depth03">
											<li><a href="#">메뉴 1-1-1</a></li>
										</ul>
									</div>
								</li>
								<li>
									<a href="#" class="accordion-name type-dot">
										<span class="name">메뉴1-2</span>
									</a>
								</li>
							</ul>
						</div>
					</div>
				</li>
			</ul>
		</div>
	</div>
	`
)