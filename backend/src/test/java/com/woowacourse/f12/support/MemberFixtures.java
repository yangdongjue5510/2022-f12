package com.woowacourse.f12.support;

import static com.woowacourse.f12.domain.member.CareerLevel.JUNIOR;
import static com.woowacourse.f12.domain.member.CareerLevel.SENIOR;
import static com.woowacourse.f12.domain.member.JobType.BACK_END;
import static com.woowacourse.f12.domain.member.JobType.FRONT_END;

import com.woowacourse.f12.domain.member.CareerLevel;
import com.woowacourse.f12.domain.member.JobType;
import com.woowacourse.f12.domain.member.Member;
import com.woowacourse.f12.dto.response.auth.GitHubProfileResponse;

public enum MemberFixtures {

    CORINNE("hamcheeseburger", "유현지", "corinne_url", SENIOR, BACK_END),
    MINCHO("jswith", "홍영민", "mincho_url", JUNIOR, FRONT_END),
    CORINNE_UPDATED("hamcheeseburger", "괴물개발자", "corinne_url", SENIOR, BACK_END);

    private final String gitHubId;
    private final String name;
    private final String imageUrl;
    private final CareerLevel careerLevel;
    private final JobType jobType;

    MemberFixtures(final String gitHubId, final String name, final String imageUrl, final CareerLevel careerLevel,
                   final JobType jobType) {
        this.gitHubId = gitHubId;
        this.name = name;
        this.imageUrl = imageUrl;
        this.careerLevel = careerLevel;
        this.jobType = jobType;
    }

    public Member 생성() {
        return 생성(null);
    }

    public Member 생성(final Long id) {
        return Member.builder()
                .id(id)
                .gitHubId(this.gitHubId)
                .name(this.name)
                .imageUrl(this.imageUrl)
                .careerLevel(this.careerLevel)
                .jobType(this.jobType)
                .build();
    }

    public GitHubProfileResponse 깃허브_프로필() {
        return new GitHubProfileResponse(this.gitHubId, this.name, this.imageUrl);
    }
}
